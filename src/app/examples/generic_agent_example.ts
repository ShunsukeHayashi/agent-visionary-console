/**
 * Example usage of the GenericAgent with the Working Backwards methodology.
 * 
 * This example demonstrates how to create and use a GenericAgent to solve
 * a task by working backwards from the goal.
 */

import { GenericAgent } from '../agent/generic_agent';
import { BaseTool, ToolCollection } from '../agent/base';

/**
 * Example tool for demonstration purposes
 */
class ExampleTool implements BaseTool {
  name: string;
  description: string;
  
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
  
  async execute(params: any): Promise<any> {
    console.log(`Executing ${this.name} with params:`, params);
    return {
      status: 'success',
      message: `${this.name} executed successfully`,
      data: { timestamp: new Date().toISOString() }
    };
  }
}

/**
 * Run an example of the GenericAgent with a specific goal
 * 
 * @param goal The goal to achieve
 */
async function runGenericAgentExample(goal: string): Promise<void> {
  console.log(`\n=== Running GenericAgent Example ===`);
  console.log(`Goal: ${goal}`);
  
  const tools = [
    new ExampleTool('search', 'Search for information'),
    new ExampleTool('calculate', 'Perform calculations'),
    new ExampleTool('fetch', 'Fetch data from an API'),
    new ExampleTool('transform', 'Transform data into a different format')
  ];
  
  const toolCollection = new ToolCollection(tools);
  
  const agent = new GenericAgent(
    'Task Solver',
    'Solves tasks using Working Backwards methodology',
    toolCollection,
    5 // Limit to 5 steps for the example
  );
  
  agent.on('thinking', (data) => {
    console.log(`\n🧠 ${data.message}`);
  });
  
  agent.on('plan-ready', (data) => {
    console.log(`\n📋 ${data.message}`);
    console.log(`Plan steps: ${data.plan.length}`);
  });
  
  agent.on('execution-start', (data) => {
    console.log(`\n▶️ ${data.message}`);
  });
  
  agent.on('step-start', (data) => {
    console.log(`\n⏳ ${data.message}`);
  });
  
  agent.on('step-complete', (data) => {
    console.log(`\n✅ ${data.message}`);
  });
  
  agent.on('execution-complete', (data) => {
    console.log(`\n🏁 ${data.message}`);
  });
  
  try {
    const result = await agent.run(goal);
    
    console.log(`\n=== Execution Results ===`);
    console.log(JSON.stringify(result, null, 2));
    
    console.log(`\n=== Agent State ===`);
    console.log(JSON.stringify(agent.getState(), null, 2));
  } catch (error) {
    console.error(`\n❌ Error running agent:`, error);
  }
}

/**
 * Main function to run the example
 */
async function main(): Promise<void> {
  const goals = [
    'Create a simple web server that displays "Hello, World!" on the home page',
    'Calculate the first 10 Fibonacci numbers and save them to a file',
    'Find the current weather in Tokyo and create a summary report'
  ];
  
  const selectedGoal = goals[0]; // Change index to try different goals
  
  await runGenericAgentExample(selectedGoal);
}

if (require.main === module) {
  main().catch(console.error);
}

export { runGenericAgentExample };
