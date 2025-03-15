import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, BarChart2, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Task } from "@/types/task";

interface TaskResultPreviewProps {
  task: Task;
  onComplete?: () => void;
}

const TaskResultPreview: React.FC<TaskResultPreviewProps> = ({ 
  task,
  onComplete
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [userRating, setUserRating] = useState<'positive' | 'negative' | null>(null);
  
  // デモ用のパフォーマンスデータ
  const performanceData = {
    humanTime: "2時間15分",
    aiTime: "45分",
    humanQuality: 85,
    aiQuality: 92,
    timeSaved: "1時間30分",
    qualityImprovement: "+7%"
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
    setShowComparison(true);
  };
  
  const handleRating = (rating: 'positive' | 'negative') => {
    setUserRating(rating);
    // ここで評価をサーバーに送信する処理を追加できます
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>タスク結果プレビュー</span>
          <Badge variant={task.status === 'completed' ? "success" : "secondary"}>
            {task.status === 'completed' ? '完了' : '進行中'}
          </Badge>
        </CardTitle>
        <CardDescription>
          タスクの完了状況と成果を確認できます
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-1">{task.name}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>進捗状況</span>
            <span>{task.progress || 0}%</span>
          </div>
          <Progress value={task.progress || 0} className="h-2" />
        </div>
        
        {showComparison && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-primary" />
              パフォーマンス比較
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium">所要時間</h5>
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">人間</span>
                  </div>
                  <span className="text-sm font-medium">{performanceData.humanTime}</span>
                </div>
                <div className="flex items-center justify-between bg-primary/10 p-2 rounded">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">AI</span>
                  </div>
                  <span className="text-sm font-medium">{performanceData.aiTime}</span>
                </div>
                <div className="flex items-center justify-between bg-success/10 p-2 rounded">
                  <span className="text-sm">時間削減</span>
                  <span className="text-sm font-medium text-success">{performanceData.timeSaved}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">品質スコア</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>人間</span>
                    <span>{performanceData.humanQuality}/100</span>
                  </div>
                  <Progress value={performanceData.humanQuality} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>AI</span>
                    <span>{performanceData.aiQuality}/100</span>
                  </div>
                  <Progress value={performanceData.aiQuality} className="h-2 bg-primary/20" indicatorClassName="bg-primary" />
                </div>
                <div className="flex items-center justify-between bg-success/10 p-2 rounded">
                  <span className="text-sm">品質向上</span>
                  <span className="text-sm font-medium text-success">{performanceData.qualityImprovement}</span>
                </div>
              </div>
            </div>
            
            {userRating === null && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm text-center mb-2">このAIの成果は役立ちましたか？</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRating('positive')}
                    className="flex items-center"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    役立った
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRating('negative')}
                    className="flex items-center"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    改善が必要
                  </Button>
                </div>
              </div>
            )}
            
            {userRating !== null && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">フィードバックありがとうございます！</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {!showComparison && (
          <Button onClick={handleComplete} className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            タスク完了
          </Button>
        )}
        
        {showComparison && !userRating && (
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            フィードバックをお願いします
          </Button>
        )}
        
        {showComparison && userRating && (
          <Button variant="outline" size="sm" className="flex items-center">
            <span>次のタスクへ</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskResultPreview;
