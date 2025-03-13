
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Database, Book, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GrowableAgentProps {
  agentId?: string;
  initialLevel?: number;
  initialExperience?: number;
  initialKnowledge?: string[];
}

const GrowableAgent: React.FC<GrowableAgentProps> = ({
  agentId,
  initialLevel = 1,
  initialExperience = 0,
  initialKnowledge = [],
}) => {
  const [level, setLevel] = useState(initialLevel);
  const [experience, setExperience] = useState(initialExperience);
  const [knowledge, setKnowledge] = useState<string[]>(initialKnowledge);
  const [isLearning, setIsLearning] = useState(false);
  const { toast } = useToast();

  // 次のレベルに必要な経験値を計算
  const experienceToNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));
  
  // 経験値パーセンテージ
  const experiencePercentage = Math.min(
    Math.floor((experience / experienceToNextLevel) * 100),
    100
  );

  // エージェントの学習プロセス
  const learnNewKnowledge = async () => {
    setIsLearning(true);
    
    try {
      // 実際の実装ではSupabaseから知識を取得するなど
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newKnowledge = `新しい知識 #${knowledge.length + 1}`;
      const gainedExp = Math.floor(Math.random() * 30) + 10;
      
      // 知識を追加
      setKnowledge(prev => [...prev, newKnowledge]);
      
      // 経験値を追加
      const newExperience = experience + gainedExp;
      setExperience(newExperience);
      
      // レベルアップの確認
      if (newExperience >= experienceToNextLevel) {
        setLevel(prev => prev + 1);
        setExperience(newExperience - experienceToNextLevel);
        
        toast({
          title: "レベルアップ！",
          description: `エージェントがレベル${level + 1}に成長しました！`,
          variant: "default",
        });
      } else {
        toast({
          title: "知識を獲得",
          description: `新たな知識を獲得し、経験値が${gainedExp}増加しました`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("学習プロセスエラー:", error);
      toast({
        title: "エラーが発生しました",
        description: "学習プロセス中にエラーが発生しました。",
        variant: "destructive"
      });
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            成長型パーソナルエージェント
          </CardTitle>
          <Badge variant="outline" className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Lv.{level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>経験値: {experience} / {experienceToNextLevel}</span>
            <span>{experiencePercentage}%</span>
          </div>
          <Progress value={experiencePercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Database className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">獲得した知識 ({knowledge.length})</h3>
          </div>
          
          {knowledge.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
              {knowledge.map((item, index) => (
                <div key={index} className="text-sm p-2 bg-secondary/10 rounded-md flex items-start">
                  <Book className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-3 border border-dashed rounded-md">
              まだ知識を獲得していません。「学習する」ボタンをクリックして新しい知識を追加しましょう。
            </div>
          )}
        </div>
        
        <Button 
          onClick={learnNewKnowledge}
          disabled={isLearning}
          className="w-full flex items-center justify-center"
        >
          {isLearning ? (
            <>
              <span className="animate-spin mr-2">
                <Brain className="h-4 w-4" />
              </span>
              学習中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              新しい知識を学習する
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GrowableAgent;
