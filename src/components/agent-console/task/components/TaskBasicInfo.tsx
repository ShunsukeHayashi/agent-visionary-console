
import React from "react";
import { Task } from "@/types/task";
import { Clock } from "lucide-react";

interface TaskBasicInfoProps {
  task: Task;
  agents: any[];
  formatDate: (dateString?: string) => string;
}

const TaskBasicInfo: React.FC<TaskBasicInfoProps> = ({ 
  task,
  agents,
  formatDate
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{task.description || "説明がありません"}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">ステータス</p>
          <div className="flex items-center mt-1">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              task.status === 'completed' ? 'bg-green-500' :
              task.status === 'in-progress' ? 'bg-blue-500' :
              'bg-amber-500'
            }`}></div>
            <p className="text-sm capitalize">
              {task.status === 'completed' ? '完了' :
               task.status === 'in-progress' ? '進行中' : '保留中'}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium">優先度</p>
          <p className="text-sm mt-1 capitalize">
            {task.priority === 'urgent' ? '緊急' :
             task.priority === 'high' ? '高' :
             task.priority === 'medium' ? '中' : '低'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">担当エージェント</p>
          <p className="text-sm mt-1">
            {task.assigned_agent_id ? 
              agents.find(a => a.id === task.assigned_agent_id)?.name || '不明なエージェント' : 
              '未割り当て'}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium">期限</p>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <p className="text-sm">{formatDate(task.deadline)}</p>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium">進捗 ({task.progress}%)</p>
        <div className="h-2 bg-muted rounded-full mt-2">
          <div 
            className={`h-2 rounded-full ${
              task.status === 'completed' ? 'bg-green-500' :
              task.status === 'in-progress' ? 'bg-blue-500' :
              'bg-amber-500'
            }`} 
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          作成日: {formatDate(task.created_at)}
          {task.updated_at && task.updated_at !== task.created_at && 
            ` · 更新日: ${formatDate(task.updated_at)}`}
        </p>
      </div>
    </div>
  );
};

export default TaskBasicInfo;
