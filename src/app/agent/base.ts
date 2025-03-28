/**
 * Base Agent Implementation
 * 
 * This module provides the foundation for all agent implementations
 * in the system, including the generic agent workflow.
 */

import { EventEmitter } from 'events';

/**
 * Base interface for all tools
 */
export interface BaseTool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

/**
 * Tool collection for managing multiple tools
 */
export class ToolCollection {
  private tools: Map<string, BaseTool>;
  
  constructor(tools: BaseTool[] = []) {
    this.tools = new Map(tools.map(tool => [tool.name, tool]));
  }
  
  /**
   * Add a tool to the collection
   * 
   * @param tool The tool to add
   */
  addTool(tool: BaseTool): void {
    this.tools.set(tool.name, tool);
  }
  
  /**
   * Remove a tool from the collection
   * 
   * @param toolName The name of the tool to remove
   */
  removeTool(toolName: string): void {
    this.tools.delete(toolName);
  }
  
  /**
   * Get a tool by name
   * 
   * @param toolName The name of the tool to get
   * @returns The tool, or undefined if not found
   */
  getTool(toolName: string): BaseTool | undefined {
    return this.tools.get(toolName);
  }
  
  /**
   * Get all tools in the collection
   * 
   * @returns Array of all tools
   */
  getAllTools(): BaseTool[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Check if a tool exists in the collection
   * 
   * @param toolName The name of the tool to check
   * @returns True if the tool exists, false otherwise
   */
  hasTool(toolName: string): boolean {
    return this.tools.has(toolName);
  }
  
  /**
   * Get the number of tools in the collection
   * 
   * @returns The number of tools
   */
  get size(): number {
    return this.tools.size;
  }
}

/**
 * Base agent class that all agents should extend
 */
export abstract class BaseAgent extends EventEmitter {
  protected name: string;
  protected description: string;
  protected tools: ToolCollection;
  protected maxSteps: number;
  
  /**
   * Create a new BaseAgent
   * 
   * @param name Agent name
   * @param description Agent description
   * @param tools Available tools for the agent
   * @param maxSteps Maximum number of steps to execute
   */
  constructor(
    name: string,
    description: string,
    tools: ToolCollection = new ToolCollection(),
    maxSteps: number = 10
  ) {
    super();
    this.name = name;
    this.description = description;
    this.tools = tools;
    this.maxSteps = maxSteps;
  }
  
  /**
   * Run the agent to accomplish a task
   * 
   * @param request The request or goal for the agent
   * @returns Promise that resolves with the result
   */
  abstract run(request?: string): Promise<any>;
  
  /**
   * Get the agent's name
   * 
   * @returns The agent's name
   */
  getName(): string {
    return this.name;
  }
  
  /**
   * Get the agent's description
   * 
   * @returns The agent's description
   */
  getDescription(): string {
    return this.description;
  }
  
  /**
   * Add a tool to the agent's toolkit
   * 
   * @param tool The tool to add
   */
  addTool(tool: BaseTool): void {
    this.tools.addTool(tool);
  }
  
  /**
   * Remove a tool from the agent's toolkit
   * 
   * @param toolName The name of the tool to remove
   */
  removeTool(toolName: string): void {
    this.tools.removeTool(toolName);
  }
  
  /**
   * Get all tools available to the agent
   * 
   * @returns Array of all tools
   */
  getTools(): BaseTool[] {
    return this.tools.getAllTools();
  }
}
