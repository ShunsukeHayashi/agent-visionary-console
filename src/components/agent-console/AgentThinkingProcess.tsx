import React, { useState, useEffect } from "react";
import { 
  ArrowBigRightDash, 
  ArrowBigLeftDash, 
  ArrowDownToLine, 
  BrainCircuit, 
  Check, 
  GitBranch,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateAgent, type AgentStep } from "@/services/agentService";

interface AgentThinkingProcessProps {
  onComplete: (steps: any[]) => void;
  initialGoal: string;
}

const AgentThinkingProcess: React.FC<AgentThinkingProcessProps> = ({ 
  onComplete, 
  initialGoal 
}) => {
  const [goal, setGoal] = useState(initialGoal);
  const [currentMode, setCurrentMode] = useState<'goal' | 'backward' | 'forward' | 'result' | 'flowchart'>('goal');
  const [backwardSteps, setBackwardSteps] = useState<any[]>([]);
  const [forwardSteps, setForwardSteps] = useState<any[]>([]);
  const [newStep, setNewStep] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [flowchartCreated, setFlowchartCreated] = useState(false);
  const { toast } = useToast();

  const handleGoalSubmit = () => {
    if (goal.trim()) {
      setCurrentMode('backward');
      // Enhance the step-back questioning with more detailed prompts
      setCurrentQuestion(
        `「${goal}」を達成するためには、直前に何を達成している必要がありますか？\n` +
        `具体的なステップと、そのステップに必要なツールや前提条件を考えてください。`
      );
    }
  };

  const addBackwardStep = () => {
    if (newStep.trim()) {
      const step = {
        id: `back-${Date.now()}`,
        content: newStep,
        completed: false
      };
      
      setBackwardSteps([...backwardSteps, step]);
      setNewStep("");
      
      setCurrentQuestion(`「${newStep}」を達成するためには、直前に何を達成している必要がありますか？`);
    }
  };

  const finishBackwardSteps = () => {
    const reversed = [...backwardSteps].reverse().map((step, index) => ({
      id: `forward-${index}`,
      content: step.content,
      completed: false
    }));
    
    setForwardSteps(reversed);
    setCurrentMode('forward');
  };

  const generateResult = () => {
    setCurrentMode('result');
  };

  const generateFlowchart = () => {
    setFlowchartCreated(true);
    setCurrentMode('flowchart');
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(forwardSteps);
    }
  };

  const toggleStepCompletion = (id: string) => {
    setForwardSteps(
      forwardSteps.map(step => 
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 border-primary/30">
        <div className="mb-4 flex items-center space-x-2">
          <BrainCircuit className="text-primary h-5 w-5" />
          <h2 className="text-lg font-medium">
            思考エージェント - Working Backwardsプロセス
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between bg-background/50 p-2 rounded-md">
            <div 
              className={`py-1 px-3 rounded-md flex items-center gap-1 ${
                currentMode === 'goal' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              <span className="text-xs font-medium">ゴール設定</span>
            </div>
            <div 
              className={`py-1 px-3 rounded-md flex items-center gap-1 ${
                currentMode === 'backward' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}
            >
              <ArrowBigLeftDash className="h-4 w-4" />
              <span className="text-xs font-medium">逆算ステップ</span>
            </div>
            <div 
              className={`py-1 px-3 rounded-md flex items-center gap-1 ${
                currentMode === 'forward' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}
            >
              <ArrowBigRightDash className="h-4 w-4" />
              <span className="text-xs font-medium">順方向再整理</span>
            </div>
            <div 
              className={`py-1 px-3 rounded-md flex items-center gap-1 ${
                currentMode === 'result' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}
            >
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">統合結果</span>
            </div>
            <div 
              className={`py-1 px-3 rounded-md flex items-center gap-1 ${
                currentMode === 'flowchart' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span className="text-xs font-medium">フローチャート</span>
            </div>
          </div>
          
          {currentMode === 'goal' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">最終ゴール</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="例: noteで月間100万円を稼ぐ"
                    className="w-full p-2 text-base border rounded-md"
                  />
                  <Button onClick={handleGoalSubmit} disabled={!goal.trim()}>
                    設定
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {currentMode === 'backward' && (
            <div className="space-y-3">
              <div>
                <div className="p-3 bg-primary/5 rounded-md mb-3">
                  <p className="text-sm font-medium">Step-back質問:</p>
                  <p className="text-base">{currentQuestion}</p>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="ステップを入力..."
                    className="w-full p-2 border rounded-md"
                  />
                  <Button onClick={addBackwardStep} disabled={!newStep.trim()}>
                    追加
                  </Button>
                </div>
              </div>
              
              {backwardSteps.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">逆算ステップ Z → A</label>
                  <ul className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                    {backwardSteps.map((step, index) => (
                      <li key={step.id} className="p-2 bg-background/80 rounded-md flex items-center">
                        <span className="font-medium mr-2">
                          {String.fromCharCode(90 - index)}:
                        </span>
                        <span>{step.content}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {backwardSteps.length >= 2 && (
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={finishBackwardSteps}
                    >
                      逆算完了 - 順方向に整理する
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {currentMode === 'forward' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">順方向ステップ A → Z</label>
                <ul className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {forwardSteps.map((step, index) => (
                    <li 
                      key={step.id} 
                      className={`p-2 rounded-md flex items-center ${
                        step.completed ? 'bg-primary/10' : 'bg-background/80'
                      }`}
                      onClick={() => toggleStepCompletion(step.id)}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      <span>{step.content}</span>
                      {step.completed && (
                        <span className="ml-auto text-sm text-primary">完了</span>
                      )}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="mt-2" 
                  onClick={generateResult}
                >
                  結果を統合する
                </Button>
              </div>
            </div>
          )}
          
          {currentMode === 'result' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">最終統合結果</label>
                <div className="p-3 border rounded-md bg-background/80">
                  <div className="mb-2">
                    <span className="font-bold">最終ゴール:</span> {goal}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">達成プロセス:</span>
                    <ul className="mt-1 space-y-1 pl-6 list-disc">
                      {forwardSteps.map((step, index) => (
                        <li key={step.id}>{step.content}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  className="mt-2" 
                  onClick={generateFlowchart}
                >
                  フローチャートを生成
                </Button>
              </div>
            </div>
          )}
          
          {currentMode === 'flowchart' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">フローチャート</label>
              
              {flowchartCreated ? (
                <div className="bg-background/80 border rounded-md p-4 h-60 flex flex-col items-center justify-center">
                  <div className="mb-4 flex flex-col items-center">
                    <div className="bg-primary text-white px-4 py-2 rounded-md mb-2 min-w-40 text-center">
                      {goal}
                    </div>
                    <ArrowBigRightDash className="rotate-90 h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {forwardSteps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="bg-muted border border-muted-foreground/30 px-3 py-2 rounded-md min-w-40 text-center">
                          {String.fromCharCode(65 + index)}: {step.content}
                        </div>
                        {index < forwardSteps.length - 1 && (
                          <ArrowBigRightDash className="rotate-90 h-5 w-5 mx-auto text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-background/80 border rounded-md p-4 h-60 flex items-center justify-center">
                  <p className="text-muted-foreground">フローチャート生成中...</p>
                </div>
              )}
              
              <Button onClick={handleComplete}>
                プロセスを完了・エージェント設定に戻る
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AgentThinkingProcess;
