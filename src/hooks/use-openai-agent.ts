import { useState, useCallback } from 'react';
import { createDirectorAgent } from '@/integrations/openai/agent';
import { createSimpleAgentWorkflow } from '@/integrations/openai/workflow';
import { AgentData, ThinkingStep } from '@/integrations/openai/types';

/**
 * Custom hook for OpenAI agent interactions
 */
export function useOpenAIAgent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  
  /**
   * Generate an agent based on a goal
   */
  const generateAgent = useCallback(async (goal: string): Promise<AgentData> => {
    setIsGenerating(true);
    setProgress(0);
    setStatusMessage('エージェントを生成中...');
    
    try {
      // Create a thinking process
      const steps: ThinkingStep[] = [
        {
          id: '1',
          type: 'goal',
          content: `目標: ${goal}`,
          completed: true,
          timestamp: Date.now()
        },
        {
          id: '2',
          type: 'backward',
          content: '目標から逆算して必要なスキルを分析中...',
          completed: false,
          timestamp: Date.now()
        }
      ];
      
      setThinkingSteps(steps);
      
      // Simulate API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update thinking steps
      const updatedSteps = [...steps];
      updatedSteps[1].completed = true;
      updatedSteps[1].content = '目標達成に必要なスキル: 自然言語処理、タスク分解、情報検索';
      
      updatedSteps.push({
        id: '3',
        type: 'forward',
        content: 'エージェント機能を構築中...',
        completed: false,
        timestamp: Date.now()
      });
      
      setThinkingSteps(updatedSteps);
      setProgress(50);
      
      // Simulate more processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Final update
      const finalSteps = [...updatedSteps];
      finalSteps[2].completed = true;
      finalSteps[2].content = 'エージェント機能: 目標分析、タスク実行、結果評価';
      
      finalSteps.push({
        id: '4',
        type: 'result',
        content: 'エージェント生成完了',
        completed: true,
        timestamp: Date.now()
      });
      
      setThinkingSteps(finalSteps);
      setProgress(100);
      
      // In a real implementation, we would call OpenAI API to generate the agent
      // For now, return a mock agent
      const goalWords = goal.split(' ');
      const agentType = goalWords.includes('データ') ? 'data' : 
                       goalWords.includes('文書') ? 'document' :
                       goalWords.includes('コード') ? 'development' : 'dynamic';
      
      return {
        name: `AI ${goal.split(' ').slice(0, 2).join(' ')}`,
        type: agentType,
        description: goal,
        dynamicGeneration: true,
        skills: [
          { name: '自然言語処理', level: 85 },
          { name: 'タスク分解', level: 90 },
          { name: '情報検索', level: 80 }
        ]
      };
    } catch (error) {
      console.error('Error generating agent:', error);
      throw new Error('エージェント生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  /**
   * Execute a task with the agent
   */
  const executeTask = useCallback(async (
    agent: AgentData, 
    task: string,
    onProgress?: (progress: number, message: string) => void
  ) => {
    setIsExecuting(true);
    setProgress(0);
    setStatusMessage('タスクを実行中...');
    
    try {
      // Create a director agent
      const directorAgent = createDirectorAgent(
        agent.name,
        `あなたは${agent.description}です。以下のタスクを実行してください。`
      );
      
      // Create a workflow
      const workflow = createSimpleAgentWorkflow(
        {
          name: agent.name,
          model: 'gpt-4-turbo-preview',
          instructions: `あなたは${agent.description}です。以下のタスクを実行してください。`,
          metadata: {
            agentType: agent.type
          }
        },
        task
      );
      
      // Set progress callback
      workflow.onProgress((stepId, event) => {
        const newProgress = event.progress || 0;
        setProgress(newProgress);
        setStatusMessage(event.message);
        onProgress?.(newProgress, event.message);
      });
      
      // Execute workflow
      const result = await workflow.execute();
      
      // Return the result
      return result;
    } catch (error) {
      console.error('Error executing task:', error);
      throw new Error('タスク実行中にエラーが発生しました');
    } finally {
      setIsExecuting(false);
    }
  }, []);
  
  return {
    generateAgent,
    executeTask,
    isGenerating,
    isExecuting,
    progress,
    statusMessage,
    thinkingSteps
  };
}
