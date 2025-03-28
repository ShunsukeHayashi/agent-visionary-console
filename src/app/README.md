# Generic Agentive Workflow Implementation

This directory contains the implementation of a generic agent workflow system based on the "Working Backwards" methodology.

## Core Concept

The Generic Agentive Workflow is defined as:

```
F(Generic Agentive Workflow) = 
  Agent(LLM, Roles & Responsibilities, Tools, Abilities) 
  achieving goals through Working Backwards methodology.
```

Specifically, it uses step-back questioning to decompose thinking from the final goal state back to the initial state.

## Implementation

The agent works as follows:

1. Goal state is clearly defined
2. Step-back questions are used to identify the state immediately before the goal
3. This process continues recursively, working backwards to the initial state
4. The steps are then reordered from initial state to goal (A→B→C→...→Z)
5. Each step is executed using reasoning and appropriate tools

This can be expressed as:

```
F(Generic Agentive Workflow) = 
  Goal → Step-back questions (Z→Y→X→...→A) →
  Reordering (A→B→C→...→Z) →
  ∫(Each step with reasoning + tool use)d(step) →
  Integrated execution plan (Result)
```

## Directory Structure

- `agent/`: Contains agent implementations
  - `base.ts`: Base agent and tool interfaces
  - `generic_agent.ts`: Generic agent implementation using Working Backwards
  - `index.ts`: Exports for easy importing
- `prompt/`: Contains prompt templates
  - `generic_agent_prompt.ts`: Prompts for the generic agent
- `examples/`: Contains example usage
  - `generic_agent_example.ts`: Example of using the generic agent

## Usage

```typescript
import { GenericAgent } from './app/agent/generic_agent';
import { ToolCollection } from './app/agent/base';

// Create tools
const tools = [...]; // Your tools here
const toolCollection = new ToolCollection(tools);

// Create the generic agent
const agent = new GenericAgent(
  'Task Solver',
  'Solves tasks using Working Backwards methodology',
  toolCollection
);

// Run the agent with a goal
const result = await agent.run('Your goal here');
console.log(result);
```

## Integration with UI Components

This implementation can be integrated with existing UI components:

- `AgentThinkingProcess.tsx`: Visualizes the Working Backwards methodology
- `AgentGenerationSequence.tsx`: Displays step-by-step agent generation
- `WorkflowEngine.tsx`: Manages workflow execution

## Event System

The agent emits events during execution that can be used to update the UI:

- `thinking`: When the agent is thinking about the next step
- `plan-ready`: When the backward planning is complete
- `execution-start`: When execution begins
- `step-start`: When a step begins execution
- `step-complete`: When a step completes execution
- `execution-complete`: When all steps are complete
- `error`: When an error occurs

## Example

See `examples/generic_agent_example.ts` for a complete example of using the GenericAgent.
