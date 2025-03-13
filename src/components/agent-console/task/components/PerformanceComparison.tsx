import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetric {
  label: string;
  humanValue: number;
  agentValue: number;
  unit: string;
  improvedBy: number;
}

interface PerformanceComparisonProps {
  metrics: PerformanceMetric[];
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ metrics }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">パフォーマンス比較</CardTitle>
        <p className="text-sm text-muted-foreground">
          手作業 vs AIエージェント自動化
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm text-green-600 font-medium">
                  {metric.improvedBy > 0 ? `${metric.improvedBy}%改善` : `${Math.abs(metric.improvedBy)}%低下`}
                </span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                <div className="text-right text-sm">
                  手作業: <span className="font-medium">{metric.humanValue}{metric.unit}</span>
                </div>
                <Progress value={100} className="h-2 bg-gray-200" />
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                <div className="text-right text-sm">
                  AI: <span className="font-medium">{metric.agentValue}{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.agentValue < metric.humanValue 
                    ? (metric.agentValue / metric.humanValue) * 100 
                    : 100} 
                  className="h-2 bg-gray-200" 
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">総合評価</h4>
          <p className="text-sm text-muted-foreground">
            AIエージェントの利用により、平均
            <span className="text-green-600 font-medium mx-1">
              {Math.round(metrics.reduce((sum, m) => sum + m.improvedBy, 0) / metrics.length)}%
            </span>
            の効率化が実現しました。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparison;
