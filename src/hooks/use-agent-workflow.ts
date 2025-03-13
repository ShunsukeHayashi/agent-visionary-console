import { useEffect, useRef, useState } from 'react';
import { OpenAIAgentWorkflow } from '@/lib/agents/OpenAIAgentWorkflow';
import { AgentAction, AgentEventData, AgentState } from '@/types/openai-agents-python';
import { useToast } from "@/hooks/use-toast";

// OpenAI API Key
const OPENAI_API_KEY = '***REMOVED***';

export const useAgentWorkflow = () => {
  const workflowRef = useRef<OpenAIAgentWorkflow>();
  const [state, setState] = useState<AgentState>({
    status: 'idle',
    currentStep: '',
    actions: []
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const workflow = new OpenAIAgentWorkflow();
    workflowRef.current = workflow;

    const handleStateChange = (data: AgentEventData) => {
      if (data.state) {
        setState(data.state);
      }
    };

    workflow.on('stateChange', handleStateChange);

    return () => {
      workflow.off('stateChange', handleStateChange);
    };
  }, []);

  const initialize = async () => {
    if (!workflowRef.current) {
      console.log('DEBUG: workflowRef.current is null');
      return false;
    }

    try {
      console.log('DEBUG: Starting initialization');
      // Get API key from environment variable or use provided key
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || OPENAI_API_KEY;
      console.log('DEBUG: API Key available:', !!apiKey);
      
      // Check if API key is available
      if (!apiKey) {
        const errorMsg = 'OpenAI API key is not configured. Please set NEXT_PUBLIC_OPENAI_API_KEY environment variable.';
        setError(errorMsg);
        toast({
          title: "API Key Missing",
          description: errorMsg,
          variant: "destructive"
        });
        throw new Error(errorMsg);
      }

      console.log('DEBUG: Calling workflowRef.current.initialize');
      await workflowRef.current.initialize({
        apiKey,
        model: 'gpt-4o',
        maxTokens: 4000,
        temperature: 0.7
      });
      console.log('DEBUG: Initialization successful');
      setIsInitialized(true);
      console.log('DEBUG: isInitialized set to true');
      return true; // Return true to indicate successful initialization
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMsg);
      toast({
        title: "Initialization Failed",
        description: errorMsg,
        variant: "destructive"
      });
      throw error;
    }
  };

  const processGoal = async (goal: string, forceInitialized = false) => {
    console.log('DEBUG: processGoal called with goal:', goal);
    console.log('DEBUG: workflowRef.current exists:', !!workflowRef.current);
    console.log('DEBUG: isInitialized:', isInitialized);
    console.log('DEBUG: forceInitialized:', forceInitialized);
    
    // Check if workflow is initialized using either the state or the forced value
    if (!workflowRef.current || (!isInitialized && !forceInitialized)) {
      const errorMsg = 'Agent workflow not initialized';
      console.log('DEBUG: Error:', errorMsg);
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      throw new Error(errorMsg);
    }

    try {
      console.log('DEBUG: Setting error to null');
      setError(null);
      console.log('DEBUG: Calling workflowRef.current.processGoal');
      await workflowRef.current.processGoal(goal);
      console.log('DEBUG: Goal processing completed successfully');
    } catch (error) {
      console.error('Failed to process goal:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log('DEBUG: Error processing goal:', errorMsg);
      setError(errorMsg);
      toast({
        title: "Processing Failed",
        description: errorMsg,
        variant: "destructive"
      });
      throw error;
    }
  };

  const getLatestAction = (): AgentAction | undefined => {
    return state.actions[state.actions.length - 1];
  };

  return {
    state,
    isInitialized,
    initialize,
    processGoal,
    getLatestAction,
    error
  };
};