import { supabase } from "@/integrations/supabase/client";

export interface AgentGoal {
  goal: string;
  useElementChain?: boolean;
  useThinkingProcess?: boolean;
}

export interface AgentStep {
  id: string;
  content: string;
  completed: boolean;
  tools?: string[];
  prerequisites?: string[];
}

export interface AgentResult {
  name: string;
  type: string;
  description: string;
  steps: AgentStep[];
  skills: Array<{ name: string; level: number }>;
}

/**
 * Generate an agent using the Working Backwards methodology
 */
export async function generateAgent(params: AgentGoal): Promise<AgentResult> {
  try {
    // Call the Supabase Edge Function that will communicate with the Python backend
    const { data, error } = await supabase.functions.invoke('generate-agent', {
      body: params,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating agent:', error);
    
    // Fallback to mock implementation if backend is not available
    return {
      name: `AI ${params.goal.split(" ").slice(0, 2).join(" ")}`,
      type: "dynamic",
      description: params.goal,
      steps: [],
      skills: [
        { name: "Working Backwards", level: 90 },
        { name: "Step-back Questioning", level: 85 },
        { name: "Task Decomposition", level: 80 }
      ]
    };
  }
}
