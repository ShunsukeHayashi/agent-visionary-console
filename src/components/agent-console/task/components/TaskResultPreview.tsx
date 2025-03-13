import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskResultPreviewProps {
  taskName: string;
  resultContent: string;
  onApprove?: () => void;
  onFeedback?: () => void;
}

const TaskResultPreview: React.FC<TaskResultPreviewProps> = ({
  taskName,
  resultContent,
  onApprove,
  onFeedback
}) => {
  return (
    <Card className="p-4 border-green-200 bg-green-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-green-700">タスク完了！</h3>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          成功
        </Badge>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-1">タスク名</p>
        <p className="font-medium">{taskName}</p>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">成果物</p>
        <div className="bg-white border rounded-md p-3 max-h-60 overflow-y-auto">
          <p className="whitespace-pre-wrap">{resultContent}</p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onFeedback}
          className="flex items-center"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          フィードバックする
        </Button>
        
        <Button 
          onClick={onApprove}
          className="flex items-center"
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          承認する
        </Button>
      </div>
    </Card>
  );
};

export default TaskResultPreview;
