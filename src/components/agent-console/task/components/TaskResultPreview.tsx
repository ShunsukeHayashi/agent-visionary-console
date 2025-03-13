import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface TaskResultPreviewProps {
  result: {
    title: string;
    content: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp?: string;
  };
}

const TaskResultPreview: React.FC<TaskResultPreviewProps> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{result.title}</CardTitle>
          <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize">{result.status}</span>
          </Badge>
        </div>
        {result.timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {result.timestamp}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md max-h-[300px] overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">{result.content}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskResultPreview;
