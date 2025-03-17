import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import IntentVisualization from './IntentVisualization';

/**
 * IntentAnalysisDemo Component
 * 
 * A demonstration component that showcases the intent analysis visualization format
 * with ◤◢◤◢ border markers for content blocks.
 */
const IntentAnalysisDemo: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const handleAnalyze = () => {
    if (userInput.trim()) {
      setShowAnalysis(true);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          ビジョナリーコンソール - Intent Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">User Input</label>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter user request or query..."
            className="h-32 resize-none"
          />
        </div>
        
        <Button 
          onClick={handleAnalyze}
          disabled={!userInput.trim()}
          className="flex items-center"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Analyze Intent
        </Button>
        
        {showAnalysis && (
          <div className="space-y-6 mt-6">
            <IntentVisualization
              type="input"
              content={userInput}
            />
            
            <IntentVisualization
              type="intent"
              content={`[Input] → [User Intent] → [Intent](Understand, Analyze, Visualize, Implement, Test, Deploy)
[Input] → [User Intent] → [Want or need Intent](Create, Visualize, Format, Display, Integrate)`}
            />
            
            <IntentVisualization
              type="goal"
              content="[Fixed User want intent] = Def Fixed Goal: Create a visualization component for intent analysis with ◤◢◤◢ border markers"
            />
            
            <IntentVisualization
              type="task"
              content={`Achieve Goal == Need Tasks[Goal]=[Tasks]
1. Create IntentVisualization component
2. Implement border marker formatting
3. Support different content types
4. Integrate with existing Working Backwards methodology
5. Test with various inputs
6. Document usage and examples`}
            />
            
            <IntentVisualization
              type="agent"
              content={`To Do Task Execute:
- Need Prompt: "Create visualization component with border markers"
- Need Tools: React, TypeScript, TailwindCSS
- Assign Agent: UI Development Agent

Agent Task Execute Feedback loop:
1. Create component → Review → Refine
2. Test integration → Review → Adjust
3. Document usage → Review → Finalize`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntentAnalysisDemo;
