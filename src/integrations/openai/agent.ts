import OpenAI from 'openai';
import type { 
  AssistantCreateParams,
  ThreadCreateParams
} from 'openai/resources/beta';
import { AgentProgressEvent, AgentResult } from './types';

// Define Run type based on OpenAI API
interface Run {
  id: string;
  status: string;
  [key: string]: unknown;
}

/**
 * Agent configuration interface
 */
export interface AgentConfig {
  name: string;
  model: string;
  instructions: string;
  tools?: Array<{
    type: 'code_interpreter' | 'retrieval' | 'function';
    function?: {
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    };
  }>;
  metadata?: Record<string, unknown>;
}

/**
 * Director Agent class for OpenAI Assistants API integration
 */
export class DirectorAgent {
  private openai: OpenAI;
  private assistantId: string | null = null;
  private threadId: string | null = null;
  private config: AgentConfig;
  private runId: string | null = null;
  
  /**
   * Constructor
   */
  constructor(config: AgentConfig) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For client-side usage
    });
    
    this.config = {
      ...config,
      model: config.model || 'gpt-4-turbo-preview'
    };
  }
  
  /**
   * Initialize the agent by creating an assistant
   */
  async initialize(): Promise<void> {
    try {
      // Create assistant
      const assistant = await this.openai.beta.assistants.create({
        name: this.config.name,
        instructions: this.config.instructions,
        model: this.config.model,
        tools: (this.config.tools || []) as AssistantCreateParams['tools'],
        metadata: this.config.metadata as Record<string, string>
      });
      
      this.assistantId = assistant.id;
      
      // Create thread
      const thread = await this.openai.beta.threads.create();
      this.threadId = thread.id;
    } catch (error) {
      console.error('Error initializing agent:', error);
      throw new Error('エージェントの初期化に失敗しました');
    }
  }
  
  /**
   * Execute a task with the agent
   */
  async executeTask(
    task: string, 
    onProgress?: (event: AgentProgressEvent) => void
  ): Promise<AgentResult> {
    if (!this.assistantId || !this.threadId) {
      throw new Error('エージェントが初期化されていません');
    }
    
    try {
      // Report thinking started
      onProgress?.({
        type: 'thinking',
        message: '目標を分析中...',
        progress: 10
      });
      
      // Add user message to thread
      await this.openai.beta.threads.messages.create(
        this.threadId,
        { role: 'user', content: task }
      );
      
      // Report processing started
      onProgress?.({
        type: 'processing',
        message: 'タスクを処理中...',
        progress: 30
      });
      
      // Create run
      const run = await this.openai.beta.threads.runs.create(
        this.threadId,
        { assistant_id: this.assistantId }
      );
      
      this.runId = run.id;
      
      // Poll for run completion
      const result = await this.pollRunStatus(run.id, onProgress);
      
      // Report completion
      onProgress?.({
        type: 'complete',
        message: '処理が完了しました',
        progress: 100
      });
      
      return result;
    } catch (error) {
      console.error('Error executing task:', error);
      
      // Report error
      onProgress?.({
        type: 'error',
        message: 'タスク実行中にエラーが発生しました',
        progress: 0
      });
      
      return {
        content: 'タスク実行中にエラーが発生しました',
        status: 'failed'
      };
    }
  }
  
  /**
   * Poll for run status until completion
   */
  private async pollRunStatus(
    runId: string,
    onProgress?: (event: AgentProgressEvent) => void
  ): Promise<AgentResult> {
    if (!this.threadId) {
      throw new Error('スレッドが初期化されていません');
    }
    
    let run: Run;
    let isCompleted = false;
    let pollCount = 0;
    
    while (!isCompleted) {
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get run status
      const retrievedRun = await this.openai.beta.threads.runs.retrieve(
        this.threadId,
        runId
      );
      run = {
        id: retrievedRun.id,
        status: retrievedRun.status,
        ...retrievedRun
      };
      
      // Update progress based on status
      pollCount++;
      const progress = Math.min(30 + (pollCount * 5), 90);
      
      switch (run.status) {
        case 'completed':
          isCompleted = true;
          break;
          
        case 'failed':
        case 'cancelled':
        case 'expired':
          onProgress?.({
            type: 'error',
            message: `実行が${run.status}で終了しました`,
            progress
          });
          
          return {
            content: `実行が${run.status}で終了しました`,
            status: 'failed'
          };
          
        case 'requires_action':
          // Handle function calling if needed
          // This is a simplified implementation
          onProgress?.({
            type: 'processing',
            message: '追加情報を取得中...',
            progress
          });
          
          // For now, just cancel the run
          await this.openai.beta.threads.runs.cancel(
            this.threadId,
            runId
          );
          
          return {
            content: '追加情報が必要です',
            status: 'requires_action'
          };
          
        default:
          // In progress statuses
          onProgress?.({
            type: 'processing',
            message: `処理中: ${run.status}`,
            progress
          });
      }
    }
    
    // Get messages after completion
    const messages = await this.openai.beta.threads.messages.list(
      this.threadId
    );
    
    // Get the latest assistant message
    const assistantMessages = messages.data.filter(
      msg => msg.role === 'assistant'
    );
    
    if (assistantMessages.length === 0) {
      return {
        content: 'エージェントからの応答がありませんでした',
        status: 'failed'
      };
    }
    
    // Get the content from the latest message
    const latestMessage = assistantMessages[0];
    let content = '';
    
    for (const contentPart of latestMessage.content) {
      if (contentPart.type === 'text') {
        content += contentPart.text.value;
      }
    }
    
    return {
      content,
      status: 'completed',
      metadata: {
        messageId: latestMessage.id,
        createdAt: latestMessage.created_at
      }
    };
  }
  
  /**
   * Get the execution status
   */
  async getExecutionStatus(): Promise<string | Record<string, unknown>> {
    if (!this.threadId || !this.runId) {
      return '実行が開始されていません';
    }
    
    try {
      const run = await this.openai.beta.threads.runs.retrieve(
        this.threadId,
        this.runId
      );
      
      return run.status;
    } catch (error) {
      console.error('Error getting execution status:', error);
      return 'ステータス取得エラー';
    }
  }
  
  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Nothing to clean up for now
    // In a production environment, you might want to delete the assistant and thread
  }
}

/**
 * Create a director agent with default configuration
 */
export function createDirectorAgent(
  name: string,
  instructions: string,
  tools?: AgentConfig['tools']
): DirectorAgent {
  return new DirectorAgent({
    name,
    model: 'gpt-4-turbo-preview',
    instructions,
    tools
  });
}
