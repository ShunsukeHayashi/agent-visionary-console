import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Bot, TrendingDown } from "lucide-react";

interface PerformanceComparisonProps {
  manualTimeMinutes: number;
  agentTimeMinutes: number;
  manualEffort: number; // 0-100
  agentEffort: number; // 0-100
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  manualTimeMinutes,
  agentTimeMinutes,
  manualEffort,
  agentEffort
}) => {
  const timeSavingPercentage = Math.round(
    ((manualTimeMinutes - agentTimeMinutes) / manualTimeMinutes) * 100
  );
  
  const effortReductionPercentage = Math.round(
    ((manualEffort - agentEffort) / manualEffort) * 100
  );
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <TrendingDown className="h-5 w-5 text-primary mr-2" />
        パフォーマンス比較：手作業 vs エージェント自動化
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">所要時間比較</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">手作業</span>
                </div>
                <span className="font-medium">{manualTimeMinutes}分</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">エージェント</span>
                </div>
                <span className="font-medium">{agentTimeMinutes}分</span>
              </div>
              <Progress 
                value={(agentTimeMinutes / manualTimeMinutes) * 100} 
                className="h-2" 
              />
            </div>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md">
            <p className="text-sm font-medium text-primary">
              時間削減率: {timeSavingPercentage}%
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">作業負荷比較</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">手作業</span>
                </div>
                <span className="font-medium">高負荷</span>
              </div>
              <Progress value={manualEffort} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">エージェント</span>
                </div>
                <span className="font-medium">低負荷</span>
              </div>
              <Progress value={agentEffort} className="h-2" />
            </div>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md">
            <p className="text-sm font-medium text-primary">
              負荷削減率: {effortReductionPercentage}%
            </p>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md border">
          <h4 className="text-sm font-medium mb-2">◤◢◤◢◤◢ 結論 ◤◢◤◢◤◢</h4>
          <p className="text-sm">
            エージェントを活用することで、あなたの業務は<strong>大幅に効率化</strong>されます。
            時間の節約だけでなく、作業負荷も軽減され、より創造的な業務に集中できるようになります。
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceComparison;
