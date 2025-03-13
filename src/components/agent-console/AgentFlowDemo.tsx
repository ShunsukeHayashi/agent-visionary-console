'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lightbulb, Rocket, Sparkles } from 'lucide-react';
import { useAgentWorkflow } from '@/hooks/use-agent-workflow';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function AgentFlowDemo() {
  const [goal, setGoal] = useState('');
  const [showSparkles, setShowSparkles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { state, isInitialized, initialize, processGoal } = useAgentWorkflow();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Initialize the agent workflow when the component mounts
  useEffect(() => {
    const initAgent = async () => {
      try {
        const result = await initialize();
        setInitializationStatus(result);
        console.log('DEBUG: Agent initialization on mount:', result);
      } catch (error) {
        console.error('Failed to initialize agent on mount:', error);
        setErrorMessage('Failed to initialize agent. Please try again.');
      }
    };

    if (!isInitialized && !initializationStatus) {
      initAgent();
    }
  }, [initialize, isInitialized, initializationStatus]);

  // Auto-scroll to bottom when new actions are added
  useEffect(() => {
    if (scrollAreaRef.current && state.actions.length > 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [state.actions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Check if we need to initialize
      let initialized = isInitialized || initializationStatus;
      if (!initialized) {
        // Try to initialize one more time
        initialized = await initialize();
        setInitializationStatus(initialized);
        console.log('DEBUG: Initialization result:', initialized);
      }
      
      // Only process the goal if initialization was successful
      if (initialized) {
        // Pass the initialized flag to processGoal to override isInitialized state check
        await processGoal(goal, initialized);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 3000);
      } else {
        console.error('Failed to initialize agent workflow');
        setErrorMessage('Failed to initialize agent. Please try again.');
      }
    } catch (error) {
      console.error('Error processing goal:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessing = state.status === 'running';
  const isComplete = state.status === 'completed';
  const hasError = state.status === 'error';

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold tracking-tight">Agent Flow Demo</h2>
        <p className="text-muted-foreground">
          Enter your goal and watch the AI agent break it down and execute it step by step.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal">What would you like the agent to do?</Label>
          <div className="flex gap-2">
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter your goal here..."
              disabled={isProcessing || isLoading}
            />
            <Button type="submit" disabled={isProcessing || isLoading || !goal.trim()}>
              {isProcessing || isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Rocket className="w-4 h-4" />
                </motion.div>
              ) : (
                'Start'
              )}
            </Button>
          </div>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2"
            >
              {errorMessage}
            </motion.div>
          )}
          {initializationStatus && !isInitialized && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-500 text-sm mt-2"
            >
              Agent initialized successfully. Ready to process your goal.
            </motion.div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {state.actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <Progress value={isComplete ? 100 : isProcessing ? 75 : 0} />
              {isProcessing && (
                <Badge variant="secondary" className="animate-pulse">
                  Processing
                </Badge>
              )}
              {isComplete && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  Complete
                </Badge>
              )}
              {hasError && (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>

            <ScrollArea ref={scrollAreaRef} className="h-[400px] rounded-md border p-4">
              {state.actions.map((action, index) => (
                <motion.div
                  key={action.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 mb-4"
                >
                  {action.type === 'step' ? (
                    <Lightbulb className="w-5 h-5 mt-1 text-yellow-500" />
                  ) : (
                    <Star className="w-5 h-5 mt-1 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="mt-1">{action.content}</p>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
          >
            <Sparkles className="w-24 h-24 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}