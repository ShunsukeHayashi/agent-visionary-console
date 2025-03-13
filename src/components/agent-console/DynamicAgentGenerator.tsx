
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface DynamicAgentGeneratorProps {
  onAgentGenerated: (agentData: any) => void;
}

const DynamicAgentGenerator: React.FC<DynamicAgentGeneratorProps> = ({
  onAgentGenerated
}) => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [useElementChain, setUseElementChain] = useState(true);
  
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
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
                <Sparkles className="h-4 w-4 mr-2" />
                エージェントを生成
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DynamicAgentGenerator;
