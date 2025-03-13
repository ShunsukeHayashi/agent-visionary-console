
import React from "react";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart, User } from "lucide-react";
import HumanTaskIndicator from "./HumanTaskIndicator";

interface TaskBasicInfoProps {
  task: Task & {
    requires_human_intervention?: boolean;
    human_intervention_type?: string;
  };
  agents: any[];
  formatDate: (date?: string) => string;
}

const TaskBasicInfo: React.FC<TaskBasicInfoProps> = ({ 
  task,
  agents,
  formatDate
}) => {
  const getStatusColor = () => {
    switch (task.status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": default: return "bg-amber-500";
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-green-500";
      case "urgent": return "bg-purple-500";
      default: return "bg-slate-500";
    }
  };

  const getAssignedAgentName = () => {
    if (!task.assigned_agent_id) return "未割り当て";
    const agent = agents.find(a => a.id === task.assigned_agent_id);
    return agent ? agent.name : "Unknown";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{task.name}</h3>
        <p className="text-sm text-muted-foreground">{task.description || "説明なし"}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">ステータス</p>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
            <span className="capitalize">{task.status === "in-progress" ? "進行中" : task.status === "completed" ? "完了" : "保留中"}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">優先度</p>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor()} mr-2`}></div>
            <span className="capitalize">{task.priority === "high" ? "高" : task.priority === "medium" ? "中" : task.priority === "low" ? "低" : "緊急"}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">担当エージェント</p>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-primary" />
            <span>{getAssignedAgentName()}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">期限</p>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(task.deadline)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">進捗状況</p>
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-2 bg-muted rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor()}`} 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-sm">{task.progress}%</span>
        </div>
      </div>
      
      {/* ヒューマンインザループの表示 */}
      {task.requires_human_intervention && (
        <div className="rounded-md border bg-muted/20 p-3 mt-2">
          <div className="flex items-center mb-2">
            <HumanTaskIndicator 
              type={task.human_intervention_type as "review" | "approval" | "manual" | "intervention"} 
              size="md"
            />
            <span className="ml-2 text-sm font-medium">ヒューマンインザループが必要</span>
          </div>
          <p className="text-xs text-muted-foreground">
            このタスクでは人間による介入が必要です。自動処理だけでは完了せず、人間の判断や作業が必要なステップがあります。
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskBasicInfo;
