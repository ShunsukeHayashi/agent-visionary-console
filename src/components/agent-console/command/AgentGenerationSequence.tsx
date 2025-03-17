
import React, { useState } from "react";
import { CommandType } from "./CommandButton";
import CommandSequence from "./CommandSequence";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { 
  Sparkles, 
  BrainCircuit, 
  Workflow, 
  Target,
  Loader2,
  ArrowUpRight,
  ListChecks
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentGenerationSequenceProps {
  onAgentGenerated: (agentData: any) => void;
}

const AgentGenerationSequence: React.FC<AgentGenerationSequenceProps> = ({ 
  onAgentGenerated 
}) => {
  const { toast } = useToast();
  const [contextData, setContextData] = useState({
    goal: "",
    skills: "",
    tasks: "",
    workflow: ""
  });
  const [generatedContext, setGeneratedContext] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateContext = (key: keyof typeof contextData, value: string) => {
    setContextData(prev => ({ ...prev, [key]: value }));
  };

  const handleSequenceComplete = (contextChain: string[]) => {
    // シーケンス完了時の処理
    setIsComplete(true);
    const fullContext = `目標: ${contextData.goal}\n\nスキル: ${contextData.skills}\n\nタスク: ${contextData.tasks}\n\nワークフロー: ${contextData.workflow}`;
    setGeneratedContext(fullContext);
    
    toast({
      title: "コマンドシーケンス完了",
      description: "すべてのコマンドが実行され、コンテキストが生成されました。",
    });
  };

  const generateAgent = () => {
    setIsGenerating(true);
    
    // エージェント生成処理（実際のプロダクションではAIサービスと連携）
    setTimeout(() => {
      const generatedAgent = {
        name: `シーケンシャルエージェント: ${contextData.goal.split(" ")[0]}`,
        type: "dynamic",
        description: generatedContext,
        dynamicGeneration: true,
        elementChain: true,
        skills: [
          { name: "コンテキスト連続処理", level: 90 },
          { name: "シーケンシャルタスク処理", level: 85 },
          { name: "ワークフロー最適化", level: 80 }
        ],
      };
      
      onAgentGenerated(generatedAgent);
      setIsGenerating(false);
    }, 1500);
  };

  const commands: CommandType[] = [
    {
      id: "define-goal",
      label: "目標定義",
      description: "達成したい目標を定義します",
      icon: "target",
      order: 1,
      action: () => {
        toast({
          title: "目標が設定されました",
          description: contextData.goal,
        });
      }
    },
    {
      id: "define-skills",
      label: "スキル定義",
      description: "エージェントに必要なスキルを定義します",
      icon: "brain",
      order: 2,
      action: () => {
        toast({
          title: "スキルが設定されました",
          description: contextData.skills || "スキルが指定されていません",
        });
      }
    },
    {
      id: "define-tasks",
      label: "タスク定義",
      description: "実行すべきタスクを定義します",
      icon: "list",
      order: 3,
      action: () => {
        toast({
          title: "タスクが設定されました",
          description: contextData.tasks || "タスクが指定されていません",
        });
      }
    },
    {
      id: "define-workflow",
      label: "ワークフロー定義",
      description: "タスクの実行順序を定義します",
      icon: "arrow",
      order: 4,
      action: () => {
        toast({
          title: "ワークフローが設定されました",
          description: contextData.workflow || "ワークフローが指定されていません",
        });
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      <div>
        <Card className="p-4 shadow-elevation transition-all hover:shadow-card">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary animate-pulse-slow" />
            コンテキスト入力
          </h3>
          
          <div className="space-y-4">
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <label className="text-sm font-medium mb-1 block flex items-center">
                目標 <span className="text-red-500 ml-1">*</span>
                <span className="ml-auto text-xs text-muted-foreground">必須</span>
              </label>
              <Textarea
                value={contextData.goal}
                onChange={(e) => updateContext("goal", e.target.value)}
                placeholder="エージェントの達成目標を入力してください"
                className="h-20 resize-none transition-all focus:border-primary/70 focus:ring-1 focus:ring-primary/70"
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <span>スキル</span>
                <span className="ml-auto text-xs text-muted-foreground">オプション</span>
              </label>
              <Textarea
                value={contextData.skills}
                onChange={(e) => updateContext("skills", e.target.value)}
                placeholder="必要なスキルをカンマ区切りで入力してください"
                className="h-20 resize-none transition-all focus:border-primary/70 focus:ring-1 focus:ring-primary/70"
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <span>タスク</span>
                <span className="ml-auto text-xs text-muted-foreground">オプション</span>
              </label>
              <Textarea
                value={contextData.tasks}
                onChange={(e) => updateContext("tasks", e.target.value)}
                placeholder="実行すべきタスクを入力してください"
                className="h-20 resize-none transition-all focus:border-primary/70 focus:ring-1 focus:ring-primary/70"
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <span>ワークフロー</span>
                <span className="ml-auto text-xs text-muted-foreground">オプション</span>
              </label>
              <Textarea
                value={contextData.workflow}
                onChange={(e) => updateContext("workflow", e.target.value)}
                placeholder="タスクの実行順序を入力してください"
                className="h-20 resize-none transition-all focus:border-primary/70 focus:ring-1 focus:ring-primary/70"
              />
            </div>
          </div>
        </Card>
        
        {isComplete && (
          <Card className="p-4 mt-4 border-green-200 bg-green-50/80 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium flex items-center text-green-700">
                <ListChecks className="h-5 w-5 mr-2 text-green-600 animate-bounce-slow" />
                生成準備完了
              </h3>
              
              <Button 
                onClick={generateAgent}
                disabled={isGenerating}
                size="sm"
                className="flex items-center shadow-sm hover:shadow-md transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    エージェント生成
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-green-600 bg-green-100/50 p-2 rounded-md">
              すべてのコマンドが実行され、エージェント生成の準備が整いました。
            </p>
          </Card>
        )}
      </div>
      
      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CommandSequence 
          initialCommands={commands} 
          onSequenceComplete={handleSequenceComplete} 
        />
      </div>
    </div>
  );
};

export default AgentGenerationSequence;
