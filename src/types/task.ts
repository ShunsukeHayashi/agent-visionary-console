
export type Task = {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  assigned_agent_id?: string;
  deadline?: string;
  project_id?: string;
  meeting_transcript_id?: string;
  planning_question_id?: string;
  checkpoint_id?: string;
  progress: number;
  created_at?: string;
  updated_at?: string;
  
  // Thought guidance framework elements
  goal?: string;             // G: Goal - What to achieve
  definition?: string;       // Def: Define - Role, constraints, knowledge
  scenario?: string;         // Scn: Scenario - Background information
  context?: string;          // Ctx: Context - Situational information
  function?: string;         // Fn: Function - Specific task to perform
  implementation?: string;   // Impl: Implementation - How to perform the task
  test_case?: string;        // TC: Test Case - How to verify the output
  validation?: string;       // Val: Validation - Evaluation of the output
  deployment?: string;       // Deply: Deployment - Integration of the output
  result?: string;           // Result: Final outcome
};

// Thought process stage in the AI agent workflow
export type ThoughtStage = 
  | "goal" 
  | "definition" 
  | "scenario" 
  | "context" 
  | "function" 
  | "implementation" 
  | "test_case" 
  | "validation" 
  | "deployment" 
  | "result";

// Mapping ThoughtStage to display names and descriptions
export const thoughtStageInfo: Record<ThoughtStage, { label: string; description: string }> = {
  goal: {
    label: "Goal (G)",
    description: "What the agent needs to achieve"
  },
  definition: {
    label: "Define (Def)",
    description: "Agent's role, constraints, and knowledge requirements"
  },
  scenario: {
    label: "Scenario (Scn)",
    description: "Background information and use cases"
  },
  context: {
    label: "Context (Ctx)",
    description: "Relevant situational information"
  },
  function: {
    label: "Function (Fn)",
    description: "Specific task or function to perform"
  },
  implementation: {
    label: "Implementation (Impl)",
    description: "How to execute the task step by step"
  },
  test_case: {
    label: "Test Case (TC)",
    description: "How to verify the task output"
  },
  validation: {
    label: "Validation (Val)",
    description: "Evaluation of the output against criteria"
  },
  deployment: {
    label: "Deployment (Deply)",
    description: "Integration of the output into systems"
  },
  result: {
    label: "Result",
    description: "Final outcome and achievement status"
  }
};
