import { DirectorAgent, AgentConfig } from './agent';
import { AgentProgressEvent, AgentResult } from './types';

/**
 * Workflow step type
 */
export type WorkflowStepType = 'agent' | 'human' | 'condition' | 'loop';

/**
 * Workflow step interface
 */
export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
  nextStepId?: string;
  alternateStepId?: string; // For conditional branching
}

/**
 * Agent workflow step configuration
 */
export interface AgentWorkflowStepConfig {
  agentConfig: AgentConfig;
  prompt: string;
  useContext?: boolean;
}

/**
 * Human workflow step configuration
 */
export interface HumanWorkflowStepConfig {
  instructions: string;
  requiresApproval: boolean;
  timeoutMinutes?: number;
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  variables: Record<string, unknown>;
  results: Record<string, AgentResult>;
  currentStepId: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
}

/**
 * Workflow engine for orchestrating agent and human tasks
 */
export class WorkflowEngine {
  private steps: Map<string, WorkflowStep> = new Map();
  private context: WorkflowContext;
  private startStepId: string | null = null;
  private onProgressCallback?: (stepId: string, event: AgentProgressEvent) => void;
  
  constructor() {
    this.context = {
      variables: {},
      results: {},
      currentStepId: '',
      status: 'paused'
    };
  }
  
  /**
   * Add a step to the workflow
   */
  addStep(step: WorkflowStep): void {
    this.steps.set(step.id, step);
    
    // Set as start step if it's the first one
    if (!this.startStepId) {
      this.startStepId = step.id;
    }
  }
  
  /**
   * Set the starting step for the workflow
   */
  setStartStep(stepId: string): void {
    if (!this.steps.has(stepId)) {
      throw new Error(`Step with ID ${stepId} not found`);
    }
    this.startStepId = stepId;
  }
  
  /**
   * Connect two steps in sequence
   */
  connectSteps(fromStepId: string, toStepId: string, isAlternate = false): void {
    const fromStep = this.steps.get(fromStepId);
    if (!fromStep) {
      throw new Error(`Step with ID ${fromStepId} not found`);
    }
    
    if (!this.steps.has(toStepId)) {
      throw new Error(`Step with ID ${toStepId} not found`);
    }
    
    if (isAlternate) {
      fromStep.alternateStepId = toStepId;
    } else {
      fromStep.nextStepId = toStepId;
    }
  }
  
  /**
   * Set a progress callback for workflow execution
   */
  onProgress(callback: (stepId: string, event: AgentProgressEvent) => void): void {
    this.onProgressCallback = callback;
  }
  
  /**
   * Execute the workflow from the start
   */
  async execute(): Promise<WorkflowContext> {
    if (!this.startStepId) {
      throw new Error("No start step defined for workflow");
    }
    
    this.context.currentStepId = this.startStepId;
    this.context.status = 'running';
    
    return this.continueExecution();
  }
  
  /**
   * Continue workflow execution from the current step
   */
  async continueExecution(): Promise<WorkflowContext> {
    while (this.context.status === 'running') {
      const currentStep = this.steps.get(this.context.currentStepId);
      if (!currentStep) {
        this.context.status = 'failed';
        break;
      }
      
      try {
        await this.executeStep(currentStep);
        
        // Move to next step if available
        if (currentStep.nextStepId) {
          this.context.currentStepId = currentStep.nextStepId;
        } else {
          // End of workflow
          this.context.status = 'completed';
        }
      } catch (error) {
        console.error(`Error executing step ${currentStep.id}:`, error);
        this.context.status = 'failed';
        break;
      }
    }
    
    return this.context;
  }
  
  /**
   * Execute a single workflow step
   */
  private async executeStep(step: WorkflowStep): Promise<void> {
    this.onProgressCallback?.(step.id, { 
      type: 'processing', 
      message: `ステップ実行中: ${step.name}`,
      progress: 0
    });
    
    switch (step.type) {
      case 'agent':
        await this.executeAgentStep(step);
        break;
      case 'human':
        // Human steps pause the workflow
        this.context.status = 'paused';
        break;
      case 'condition':
        this.executeConditionStep(step);
        break;
      case 'loop':
        // Not implemented yet
        break;
    }
    
    this.onProgressCallback?.(step.id, { 
      type: 'complete', 
      message: `ステップ完了: ${step.name}`,
      progress: 100
    });
  }
  
  /**
   * Execute an agent workflow step
   */
  private async executeAgentStep(step: WorkflowStep): Promise<void> {
    const config = step.config as unknown as AgentWorkflowStepConfig;
    if (!config) {
      throw new Error(`No configuration for agent step ${step.id}`);
    }
    
    const agent = new DirectorAgent(config.agentConfig);
    await agent.initialize();
    
    try {
      // Build prompt with context if needed
      let prompt = config.prompt;
      if (config.useContext) {
        // Add context variables to prompt
        const contextStr = JSON.stringify(this.context.variables, null, 2);
        prompt = `${prompt}\n\nContext:\n${contextStr}`;
      }
      
      // Execute the agent task with progress reporting
      const result = await agent.executeTask(prompt, (event) => {
        this.onProgressCallback?.(step.id, event);
      });
      
      // Store the result
      this.context.results[step.id] = result;
      
      // Extract variables from result if needed
      // This is a simple implementation - could be enhanced with patterns/extraction logic
      this.context.variables[`${step.id}_result`] = result.content;
      
    } finally {
      await agent.cleanup();
    }
  }
  
  /**
   * Execute a condition workflow step
   */
  private executeConditionStep(step: WorkflowStep): void {
    // Simple condition implementation
    // In a real implementation, this would evaluate expressions
    const condition = (step.config as unknown as { condition: unknown })?.condition;
    if (!condition) {
      throw new Error(`No condition defined for step ${step.id}`);
    }
    
    let result = false;
    
    // Very simple condition evaluation
    if (typeof condition === 'string') {
      // Check if variable exists and is truthy
      result = Boolean(this.context.variables[condition]);
    } else if (typeof condition === 'function') {
      result = condition(this.context.variables);
    }
    
    // Set next step based on condition result
    if (!result && step.alternateStepId) {
      step.nextStepId = step.alternateStepId;
    }
  }
  
  /**
   * Submit a human task result and continue workflow
   */
  submitHumanTaskResult(stepId: string, result: string | Record<string, unknown>): void {
    if (this.context.currentStepId !== stepId) {
      throw new Error(`Current step is ${this.context.currentStepId}, not ${stepId}`);
    }
    
    const step = this.steps.get(stepId);
    if (!step || step.type !== 'human') {
      throw new Error(`Step ${stepId} is not a human task`);
    }
    
    // Store the result
    this.context.results[stepId] = {
      content: typeof result === 'string' ? result : JSON.stringify(result),
      status: 'completed'
    };
    
    // Add to variables
    this.context.variables[`${stepId}_result`] = result;
    
    // Move to next step
    if (step.nextStepId) {
      this.context.currentStepId = step.nextStepId;
      this.context.status = 'running';
    } else {
      this.context.status = 'completed';
    }
  }
  
  /**
   * Get the current workflow context
   */
  getContext(): WorkflowContext {
    return { ...this.context };
  }
  
  /**
   * Reset the workflow
   */
  reset(): void {
    this.context = {
      variables: {},
      results: {},
      currentStepId: this.startStepId || '',
      status: 'paused'
    };
  }
}

/**
 * Create a simple linear workflow with a single agent
 */
export function createSimpleAgentWorkflow(
  agentConfig: AgentConfig,
  task: string
): WorkflowEngine {
  const workflow = new WorkflowEngine();
  
  // Create a single agent step
  const step: WorkflowStep = {
    id: 'agent_task',
    type: 'agent',
    name: 'AIエージェントタスク',
    description: 'AIエージェントによるタスク実行',
    config: {
      agentConfig,
      prompt: task
    }
  };
  
  workflow.addStep(step);
  
  return workflow;
}
