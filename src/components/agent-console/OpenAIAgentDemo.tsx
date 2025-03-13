import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, Check, Clock } from 'lucide-react';
import { useOpenAIAgent } from '@/hooks/use-openai-agent';
import { AgentData } from '@/integrations/openai/types';
import TaskResultPreview from './task/components/TaskResultPreview';
import PerformanceComparison from './task/components/PerformanceComparison';

const OpenAIAgentDemo: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [step, setStep] = useState<'input' | 'generating' | 'executing' | 'completed'>('input');
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [result, setResult] = useState<string>('');
  
  const { 
    generateAgent, 
    executeTask,
    isGenerating,
    isExecuting,
    progress,
    statusMessage
  } = useOpenAIAgent();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal.trim()) return;
    
    try {
      // Step 1: Generate agent
      setStep('generating');
      const generatedAgent = await generateAgent(goal);
      setAgent(generatedAgent);
      
      // Step 2: Execute task
      setStep('executing');
      const workflowResult = await executeTask(
        generatedAgent,
        `以下の目標を達成してください: ${goal}`,
        (progress, message) => {
          console.log(`Progress: ${progress}%, Message: ${message}`);
        }
      );
      
      // Get result from the first step
      const taskResult = workflowResult.results['agent_task'];
      if (taskResult) {
        setResult(taskResult.content);
      }
      
      // Step 3: Show completion
      setStep('completed');
      
    } catch (error) {
      console.error('Error in agent demo flow:', error);
      // Reset to input step on error
      setStep('input');
    }
  };
  
  const resetDemo = () => {
    setGoal('');
    setStep('input');
    setAgent(null);
    setResult('');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'input':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium mb-1">
                あなたのタスクを教えてください
              </label>
              <Textarea
                id="goal"
                placeholder="例: SNS投稿を作成する、営業メールを書く、ブログ記事を作成する..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              AIエージェントを生成する
            </Button>
          </form>
        );
        
      case 'generating':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">エージェント生成中...</h3>
              <p className="text-sm text-muted-foreground">
                タスクをAIが即座に分析し、最適なエージェントを瞬時に生成します
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗状況</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground italic mt-1">
                {statusMessage || 'スキル判定中...'}
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-2">処理ステップ:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>タスク分析</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  <span>最適ツール選択中...</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-4 w-4 mr-2">•</span>
                  <span>エージェント生成</span>
                </li>
              </ul>
            </div>
          </div>
        );
        
      case 'executing':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">タスク実行中...</h3>
              <p className="text-sm text-muted-foreground">
                エージェントが即座にタスクを自動実行中！あなたは成果を待つだけ
              </p>
            </div>
            
            {agent && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-2">エージェント情報:</p>
                <p className="text-sm"><span className="font-medium">名前:</span> {agent.name}</p>
                <p className="text-sm"><span className="font-medium">タイプ:</span> {agent.type}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">スキル:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-background px-2 py-1 rounded-full">
                        {skill.name} ({skill.level}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗状況</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground italic mt-1">
                {statusMessage || 'タスク実行中...'}
              </p>
            </div>
          </div>
        );
        
      case 'completed':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">タスク完了！</h3>
              <p className="text-sm text-muted-foreground">
                AIエージェントがあなたの業務を自動化しました！
              </p>
            </div>
            
            <TaskResultPreview 
              result={{
                title: goal,
                content: result,
                status: 'completed',
                timestamp: new Date().toLocaleString('ja-JP')
              }}
            />
            
            <PerformanceComparison 
              metrics={[
                {
                  label: '所要時間',
                  humanValue: 30,
                  agentValue: 2,
                  unit: '分',
                  improvedBy: 93
                },
                {
                  label: '作業負荷',
                  humanValue: 85,
                  agentValue: 10,
                  unit: '%',
                  improvedBy: 88
                },
                {
                  label: 'コスト',
                  humanValue: 3000,
                  agentValue: 300,
                  unit: '円',
                  improvedBy: 90
                }
              ]}
            />
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={resetDemo}>
                新しいタスクを開始
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Agent Flow Demo</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default OpenAIAgentDemo;
