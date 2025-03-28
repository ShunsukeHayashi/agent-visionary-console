/**
 * Generic Agent Implementation
 * 
 * This module implements a generic agent that uses the Working Backwards methodology
 * to solve problems step by step.
 */

export interface Tool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

export interface Step {
  id: string;
  description: string;
  prerequisites: string[];
  toolsNeeded: string[];
  completed: boolean;
  result?: any;
}

export interface AgentState {
  goalState: string;
  currentState: string;
  backwardsSteps: Step[];
  forwardPlan: Step[];
  completedSteps: Step[];
  pendingSteps: Step[];
  currentStepIndex: number;
  planReady: boolean;
  currentProgress: string;
}

/**
 * GenericAgent class implementing the Working Backwards methodology
 * 
 * Formula: F(Generic Agentive Workflow) = 
 *   Goal → Step-back questions (Z→Y→X→...→A) →
 *   Reordering (A→B→C→...→Z) →
 *   ∫(Each step with reasoning + tool use)d(step) →
 *   Integrated execution plan (Result)
 */
export class GenericAgent {
  private state: AgentState;
  private tools: Map<string, Tool>;
  private maxSteps: number;
  private thinking: boolean;
  
  /**
   * Create a new GenericAgent
   * 
   * @param goalState The desired end state to achieve
   * @param tools Available tools for the agent to use
   * @param maxSteps Maximum number of steps to execute
   */
  private listeners: Map<string, Array<(data: any) => void>>;
  
  constructor(goalState: string, tools: Tool[] = [], maxSteps: number = 10) {
    this.tools = new Map(tools.map(tool => [tool.name, tool]));
    this.maxSteps = maxSteps;
    this.thinking = false;
    this.listeners = new Map();
    
    this.state = {
      goalState,
      currentState: "Initial state",
      backwardsSteps: [],
      forwardPlan: [],
      completedSteps: [],
      pendingSteps: [],
      currentStepIndex: 0,
      planReady: false,
      currentProgress: "Planning phase - Working backwards from goal"
    };
  }
  
  /**
   * Register an event listener
   * 
   * @param event The event to listen for
   * @param listener The listener function
   */
  on(event: string, listener: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }
  
  /**
   * Emit an event
   * 
   * @param event The event to emit
   * @param data The data to pass to listeners
   */
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(data);
      }
    }
  }
  
  /**
   * Start the Working Backwards process
   * 
   * @returns Promise that resolves when planning is complete
   */
  async planBackwards(): Promise<void> {
    this.thinking = true;
    this.emit('thinking', { message: `Planning backwards from goal: ${this.state.goalState}` });
    
    try {
      await this.stepBackQuestions();
      
      this.reorderSteps();
      
      this.state.planReady = true;
      this.state.pendingSteps = [...this.state.forwardPlan];
      this.thinking = false;
      
      this.emit('plan-ready', { 
        message: "Plan is ready for execution",
        plan: this.state.forwardPlan
      });
    } catch (error) {
      this.thinking = false;
      this.emit('error', { message: `Planning error: ${error}` });
      throw error;
    }
  }
  
  /**
   * Execute the forward plan
   * 
   * @returns Promise that resolves when execution is complete
   */
  async execute(): Promise<void> {
    if (!this.state.planReady) {
      throw new Error("Cannot execute before planning is complete");
    }
    
    this.emit('execution-start', { 
      message: "Starting execution of plan",
      plan: this.state.forwardPlan
    });
    
    try {
      while (this.state.currentStepIndex < this.state.forwardPlan.length) {
        if (this.state.currentStepIndex >= this.maxSteps) {
          this.emit('max-steps-reached', { 
            message: `Reached maximum steps (${this.maxSteps})`,
            completedSteps: this.state.completedSteps,
            remainingSteps: this.state.pendingSteps
          });
          break;
        }
        
        const currentStep = this.state.forwardPlan[this.state.currentStepIndex];
        
        this.emit('step-start', { 
          message: `Executing step ${this.state.currentStepIndex + 1}/${this.state.forwardPlan.length}`,
          step: currentStep
        });
        
        const result = await this.executeStep(currentStep);
        
        currentStep.completed = true;
        currentStep.result = result;
        
        this.state.completedSteps.push(currentStep);
        this.state.currentStepIndex++;
        this.state.pendingSteps = this.state.forwardPlan.slice(this.state.currentStepIndex);
        
        this.state.currentProgress = `Completed ${this.state.completedSteps.length}/${this.state.forwardPlan.length} steps`;
        
        this.emit('step-complete', { 
          message: `Completed step ${this.state.currentStepIndex}/${this.state.forwardPlan.length}`,
          step: currentStep,
          result
        });
      }
      
      this.emit('execution-complete', { 
        message: "Execution complete",
        completedSteps: this.state.completedSteps
      });
    } catch (error) {
      this.emit('error', { message: `Execution error: ${error}` });
      throw error;
    }
  }
  
  /**
   * Run the full agent workflow (plan and execute)
   * 
   * @returns Promise that resolves when the workflow is complete
   */
  async run(): Promise<any> {
    await this.planBackwards();
    await this.execute();
    return this.getResults();
  }
  
  /**
   * Get the current results of the agent's work
   * 
   * @returns Object containing the agent's results
   */
  getResults(): any {
    return {
      goalState: this.state.goalState,
      completedSteps: this.state.completedSteps,
      pendingSteps: this.state.pendingSteps,
      currentProgress: this.state.currentProgress,
      success: this.state.currentStepIndex >= this.state.forwardPlan.length
    };
  }
  
  /**
   * Get the current state of the agent
   * 
   * @returns The agent's current state
   */
  getState(): AgentState {
    return { ...this.state };
  }
  
  /**
   * Add a tool to the agent's toolkit
   * 
   * @param tool The tool to add
   */
  addTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }
  
  /**
   * Remove a tool from the agent's toolkit
   * 
   * @param toolName The name of the tool to remove
   */
  removeTool(toolName: string): void {
    this.tools.delete(toolName);
  }
  
  /**
   * Add a backward step manually
   * 
   * @param description Step description
   * @param prerequisites Prerequisites for this step
   * @param toolsNeeded Tools needed for this step
   */
  addBackwardStep(description: string, prerequisites: string[] = [], toolsNeeded: string[] = []): void {
    const step: Step = {
      id: `back-${Date.now()}-${this.state.backwardsSteps.length}`,
      description,
      prerequisites,
      toolsNeeded,
      completed: false
    };
    
    this.state.backwardsSteps.push(step);
    this.emit('backward-step-added', { step });
  }
  
  /**
   * Private method to simulate the step-back questioning process
   * This would typically involve LLM calls in a real implementation
   */
  private async stepBackQuestions(): Promise<void> {
    
    let currentState = this.state.goalState;
    
    const numSteps = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking time
      
      const stepDescription = `Step to achieve: ${currentState}`;
      const prerequisites = [`Prerequisite ${i+1} for ${currentState}`];
      const toolsNeeded = Array.from(this.tools.keys()).slice(0, Math.floor(Math.random() * this.tools.size));
      
      this.addBackwardStep(stepDescription, prerequisites, toolsNeeded);
      
      currentState = `Precondition ${i+1} for ${this.state.goalState}`;
      
      this.emit('thinking-progress', { 
        message: `Working backwards: Step ${i+1}`,
        currentState
      });
    }
  }
  
  /**
   * Private method to reorder backward steps into a forward plan
   */
  private reorderSteps(): void {
    this.state.forwardPlan = [...this.state.backwardsSteps]
      .reverse()
      .map((step, index) => ({
        ...step,
        id: `forward-${index}`
      }));
    
    this.emit('plan-created', { 
      message: "Forward plan created",
      plan: this.state.forwardPlan
    });
  }
  
  /**
   * Private method to execute a single step
   * 
   * @param step The step to execute
   * @returns Promise that resolves with the step result
   */
  private async executeStep(step: Step): Promise<any> {
    for (const toolName of step.toolsNeeded) {
      if (!this.tools.has(toolName)) {
        throw new Error(`Missing required tool: ${toolName}`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = await Promise.all(
      step.toolsNeeded.map(async toolName => {
        const tool = this.tools.get(toolName);
        if (!tool) return null;
        
        try {
          return await tool.execute({ step });
        } catch (error) {
          this.emit('tool-error', { 
            message: `Error executing tool ${toolName}`,
            error
          });
          return null;
        }
      })
    );
    
    return {
      stepId: step.id,
      toolResults: results.filter(Boolean)
    };
  }
}
