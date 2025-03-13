
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Loader2, Brain } from "lucide-react";
import { Label } from "@/components/ui/label";
import AgentThinkingProcess from "./AgentThinkingProcess";

interface DynamicAgentGeneratorProps {
  onAgentGenerated: (agentData: any) => void;
}

const DynamicAgentGenerator: React.FC<DynamicAgentGeneratorProps> = ({
  onAgentGenerated
}) => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [useElementChain, setUseElementChain] = useState(true);
  const [useThinkingProcess, setUseThinkingProcess] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    if (useThinkingProcess) {
      setThinkingMode(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 実際のプロダクションでは、AIサービスとの連携が必要です
      // ここではモックデータを使用します
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const goalWords = goal.split(" ");
      const agentType = goalWords.includes("データ") ? "data" : 
                       goalWords.includes("文書") ? "document" :
                       goalWords.includes("コード") ? "development" : "dynamic";
      
      const generatedAgent = {
        name: `AI ${goal.split(" ").slice(0, 2).join(" ")}`,
        type: agentType,
        description: goal,
        dynamicGeneration: true,
        elementChain: useElementChain,
        skills: [
          { name: "Natural Language Processing", level: 85 },
          { name: "Goal-Oriented Task Execution", level: 90 }
        ],
      };
      
      onAgentGenerated(generatedAgent);
    } catch (error) {
      console.error("Error generating agent:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleThinkingProcessComplete = (steps: any[]) => {
    setThinkingMode(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      const stepContents = steps.map(step => step.content);
      
      const generatedAgent = {
        name: `思考型AI ${goal.split(" ").slice(0, 2).join(" ")}`,
        type: "dynamic",
        description: `${goal}\n\n具体的ステップ:\n${stepContents.join('\n')}`,
        dynamicGeneration: true,
        elementChain: useElementChain,
        skills: [
          { name: "逆算思考", level: 95 },
          { name: "Step-back質問法", level: 90 },
          { name: "タスク分解", level: 85 }
        ],
      };
      
      onAgentGenerated(generatedAgent);
      setIsGenerating(false);
    }, 1500);
  };
  
  if (thinkingMode) {
    return <AgentThinkingProcess 
      onComplete={handleThinkingProcessComplete} 
      initialGoal={goal}
    />;
  }
  
  return (
    <Card className="p-5 border border-dashed border-primary/50 bg-primary/5">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        ゴールからエージェントを生成
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="goal-input">達成したい目標</Label>
          <Textarea
            id="goal-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="例: データを分析して週次レポートを自動生成する、顧客からの問い合わせに自動応答する..."
            className="h-32 resize-none mt-1"
          />
        </div>
        
        <div className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="element-chain">Element Chain 実行</Label>
            <p className="text-sm text-muted-foreground">
              タスクを要素単位に分解して順次実行します
            </p>
          </div>
          <Switch
            id="element-chain"
            checked={useElementChain}
            onCheckedChange={setUseElementChain}
          />
        </div>
        
        <div className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="thinking-process">逆算思考プロセス</Label>
            <p className="text-sm text-muted-foreground">
              Working Backwards手法で逆算的に思考ステップを生成します
            </p>
          </div>
          <Switch
            id="thinking-process"
            checked={useThinkingProcess}
            onCheckedChange={setUseThinkingProcess}
          />
        </div>
        
        {useThinkingProcess && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start">
            <Brain className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                逆算思考プロセスを使用すると、ゴールから逆方向に「Step-back質問法」を用いてステップを導き出します。
              </p>
              <p className="text-sm text-blue-600 mt-1">
                F(Achieve goal) = ∫ Agent(LLM, R&R, Tools) × Step-back questions → 最終Result
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={!goal.trim() || isGenerating}
            className="flex items-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                {useThinkingProcess ? (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    思考プロセスを開始
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    エージェントを生成
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DynamicAgentGenerator;
