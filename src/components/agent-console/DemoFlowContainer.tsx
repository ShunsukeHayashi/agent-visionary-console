import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, BrainCircuit, Cog, CheckCircle, BarChart } from "lucide-react";
import DynamicAgentGenerator from "./DynamicAgentGenerator";
import AgentThinkingProcess from "./AgentThinkingProcess";
import AgentGenerationSequence from "./command/AgentGenerationSequence";
import TaskResultPreview from "./task/components/TaskResultPreview";
import PerformanceComparison from "./task/components/PerformanceComparison";

interface AgentData {
  name: string;
  type: string;
  description: string;
  dynamicGeneration: boolean;
  elementChain: boolean;
  skills: Array<{ name: string; level: number }>;
}

interface ThinkingStep {
  id: string;
  content: string;
  completed: boolean;
}

const DemoFlowContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [goal, setGoal] = useState("");
  const [generatedAgent, setGeneratedAgent] = useState<AgentData | null>(null);
  const [useThinkingProcess, setUseThinkingProcess] = useState(true);
  
  const handleGoalSubmit = (inputGoal: string) => {
    setGoal(inputGoal);
    setCurrentStep(2);
  };
  
  const handleAgentGenerated = (agentData: AgentData) => {
    setGeneratedAgent(agentData);
    setCurrentStep(3);
    
    // Automatically progress to step 4 after a delay
    setTimeout(() => {
      setCurrentStep(4);
    }, 5000);
  };
  
  const handleThinkingComplete = (steps: ThinkingStep[]) => {
    // Convert thinking steps to agent data
    const agentData: AgentData = {
      name: "思考プロセスエージェント",
      type: "分析",
      description: `${goal}のための思考プロセスから生成されたエージェント`,
      dynamicGeneration: true,
      elementChain: false,
      skills: [
        { name: "問題分析", level: 85 },
        { name: "計画立案", level: 90 },
        { name: "実行能力", level: 80 },
        { name: "情報統合", level: 75 }
      ]
    };
    
    handleAgentGenerated(agentData);
  };
  
  const handleTaskComplete = () => {
    setCurrentStep(5);
  };
  
  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Sparkles className="h-5 w-5" />;
      case 2: return <BrainCircuit className="h-5 w-5" />;
      case 3: return <Cog className="h-5 w-5" />;
      case 4: return <CheckCircle className="h-5 w-5" />;
      case 5: return <BarChart className="h-5 w-5" />;
      default: return null;
    }
  };
  
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "ゴール入力";
      case 2: return "エージェント生成";
      case 3: return "タスク実行";
      case 4: return "タスク完了";
      case 5: return "パフォーマンス比較";
      default: return "";
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">あなたのタスクを教えてください。瞬時にAIエージェントを作成します！</h2>
              <p className="text-muted-foreground">
                目標を入力するだけで、最適なAIエージェントが自動的に生成されます。
              </p>
            </div>
            
            <DynamicAgentGenerator 
              onAgentGenerated={handleAgentGenerated} 
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">タスクをAIが即座に分析し、最適なエージェントを瞬時に生成します</h2>
              <p className="text-muted-foreground">
                AIがあなたの目標を分析し、最適なスキルとツールを持つエージェントを生成しています...
              </p>
            </div>
            
            {useThinkingProcess ? (
              <AgentThinkingProcess 
                initialGoal={goal} 
                onComplete={handleThinkingComplete}
              />
            ) : (
              <AgentGenerationSequence 
                onAgentGenerated={handleAgentGenerated} 
              />
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">エージェントが即座にタスクを自動実行中！あなたは成果を待つだけ</h2>
              <p className="text-muted-foreground">
                生成されたエージェントがタスクを自動的に実行しています。しばらくお待ちください...
              </p>
            </div>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">エージェントプロフィール</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">名前</p>
                  <p className="font-medium">{generatedAgent?.name || "AI Assistant"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">タイプ</p>
                  <p className="font-medium">{generatedAgent?.type || "汎用"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">説明</p>
                  <p className="text-sm">{generatedAgent?.description || "タスク実行のための汎用AIエージェント"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">スキル</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {generatedAgent?.skills?.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{skill.name}</span>
                          <span className="text-xs font-medium">{skill.level}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">タスク実行進捗</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">進捗状況</span>
                      <span className="text-xs font-medium">75%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary animate-pulse" 
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="w-full"
                >
                  タスク完了を確認する
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">タスク完了！AIエージェントがあなたの業務を自動化しました！</h2>
              <p className="text-muted-foreground">
                エージェントがタスクを完了しました。成果をご確認ください。
              </p>
            </div>
            
            <TaskResultPreview 
              taskName={goal || "AIエージェントによるタスク"}
              resultContent={`◤◢◤◢◤◢ タスク成果物 ◤◢◤◢◤◢\n\n${goal}の実行結果として、以下の成果物が生成されました：\n\n1. 目標分析レポート\n2. 実行計画書\n3. 成果物一式\n\n詳細な内容は添付ファイルをご確認ください。`}
              onApprove={handleTaskComplete}
              onFeedback={() => {}}
            />
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">あなたの業務は、これほどまでに簡単になります</h2>
              <p className="text-muted-foreground">
                AIエージェントを活用することで、大幅な時間短縮と作業負荷の軽減が実現します。
              </p>
            </div>
            
            <PerformanceComparison 
              manualTimeMinutes={120}
              agentTimeMinutes={15}
              manualEffort={90}
              agentEffort={20}
            />
            
            <div className="flex justify-center mt-6">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setCurrentStep(1)}
              >
                新しいタスクを始める
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step}
            className={`flex-1 py-2 px-3 rounded-md flex flex-col items-center ${
              currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-transparent'
            }`}
          >
            <div className="flex items-center mb-1">
              {getStepIcon(step)}
              {step < currentStep && (
                <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
              )}
            </div>
            <span className="text-xs font-medium">{getStepTitle(step)}</span>
          </div>
        ))}
      </div>
      
      {renderStepContent()}
    </div>
  );
};

export default DemoFlowContainer;
