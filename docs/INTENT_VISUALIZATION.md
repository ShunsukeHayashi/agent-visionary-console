# Intent Visualization Format

This document explains the intent visualization format used in the Visionary Console.

## Format Overview

The intent visualization format uses ◤◢◤◢ border markers for content blocks instead of XML-style tags. This creates a visually distinct representation of different types of content.

## Format Structure

```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
[Content goes here]
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

## Content Types

The format supports different types of content:

1. **User Input** - The original input from the user
2. **Intent Analysis** - Analysis of the user's intent
3. **Fixed Goal** - The defined goal based on the user's intent
4. **Task Breakdown** - The tasks needed to achieve the goal
5. **Agent Assignment** - The agent assigned to execute the tasks

## Intent Analysis Structure

The intent analysis follows this structure:

```
[Input] → [User Intent] → [Intent](Action1, Action2, ...)
[Input] → [User Intent] → [Want or need Intent](Need1, Need2, ...)
```

## Fixed Goal Structure

The fixed goal follows this structure:

```
[Fixed User want intent] = Def Fixed Goal: [Goal description]
```

## Task Breakdown Structure

The task breakdown follows this structure:

```
Achieve Goal == Need Tasks[Goal]=[Tasks]
1. [Task 1]
2. [Task 2]
...
```

## Agent Assignment Structure

The agent assignment follows this structure:

```
To Do Task Execute:
- Need Prompt: [Prompt]
- Need Tools: [Tool1, Tool2, ...]
- Assign Agent: [Agent]

Agent Task Execute Feedback loop:
1. [Step 1] → [Review] → [Refine]
2. [Step 2] → [Review] → [Adjust]
...
```

## Example

Here's a complete example of the intent visualization format:

User Input:
```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
Create a visualization component for intent analysis
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

Intent Analysis:
```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
[Input] → [User Intent] → [Intent](Create, Visualize, Analyze)
[Input] → [User Intent] → [Want or need Intent](Component, Format, Display)
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

Fixed Goal:
```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
[Fixed User want intent] = Def Fixed Goal: Create a visualization component for intent analysis with border markers
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

Task Breakdown:
```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
Achieve Goal == Need Tasks[Goal]=[Tasks]
1. Create IntentVisualization component
2. Implement border marker formatting
3. Support different content types
4. Integrate with existing Working Backwards methodology
5. Test with various inputs
6. Document usage and examples
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

Agent Assignment:
```
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
To Do Task Execute:
- Need Prompt: "Create visualization component with border markers"
- Need Tools: React, TypeScript, TailwindCSS
- Assign Agent: UI Development Agent

Agent Task Execute Feedback loop:
1. Create component → Review → Refine
2. Test integration → Review → Adjust
3. Document usage → Review → Finalize
◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢
```

## Integration with Working Backwards Methodology

The intent visualization format complements the Working Backwards methodology by providing a clear visual representation of the different stages of the process:

1. **User Input** - The starting point
2. **Intent Analysis** - Understanding what the user wants
3. **Fixed Goal** - Defining the end goal
4. **Task Breakdown** - Working backwards from the goal to identify the necessary tasks
5. **Agent Assignment** - Assigning the tasks to the appropriate agent

This format helps to visualize the Working Backwards methodology in a way that is easy to understand and follow.

## Usage in the Visionary Console

To use the intent visualization format in the Visionary Console, import the `IntentVisualization` component:

```tsx
import IntentVisualization from '@/components/agent-console/IntentVisualization';

// Then use it in your component
<IntentVisualization
  type="intent"
  content="[Input] → [User Intent] → [Intent](Action1, Action2, ...)"
/>
```

You can also use the standalone HTML demo to quickly test the format without requiring the full repository.
