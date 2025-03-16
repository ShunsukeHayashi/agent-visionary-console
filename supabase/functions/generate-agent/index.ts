import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase initialization
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// OpenAI API configuration
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';

// Function to simulate the Working Backwards methodology
async function generateAgentWithWorkingBackwards(goal: string): Promise<any> {
  try {
    // Call OpenAI to generate steps using Working Backwards methodology
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an AI agent that uses the Working Backwards methodology to solve problems.
            Start with the goal and work backwards to identify the steps needed to achieve it.
            For each step, identify the tools needed and prerequisites.`
          },
          {
            role: 'user',
            content: `Generate a plan for achieving this goal using Working Backwards methodology: "${goal}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const result = await response.json();
    
    if (!result.choices || !result.choices[0]) {
      throw new Error('Failed to generate agent steps');
    }
    
    // Parse the response to extract steps
    const content = result.choices[0].message.content;
    const steps = parseStepsFromContent(content);
    
    // Generate agent data
    return {
      name: `AI ${goal.split(" ").slice(0, 2).join(" ")}`,
      type: "dynamic",
      description: goal,
      steps,
      skills: [
        { name: "Working Backwards", level: 90 },
        { name: "Step-back Questioning", level: 85 },
        { name: "Task Decomposition", level: 80 }
      ]
    };
  } catch (error) {
    console.error('Error in generateAgentWithWorkingBackwards:', error);
    throw error;
  }
}

// Helper function to parse steps from OpenAI response
function parseStepsFromContent(content: string): any[] {
  // Simple parsing logic - can be enhanced for better extraction
  const steps = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\.\s/)) {
      steps.push({
        id: `step-${Date.now()}-${steps.length}`,
        content: line.replace(/^\d+\.\s/, ''),
        completed: false
      });
    }
  }
  
  return steps;
}

serve(async (req) => {
  // CORS preflight request handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, useElementChain, useThinkingProcess } = await req.json();
    
    if (!goal) {
      return new Response(
        JSON.stringify({ error: 'Goal is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate agent using Working Backwards methodology
    const agentData = await generateAgentWithWorkingBackwards(goal);
    
    return new Response(
      JSON.stringify(agentData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
