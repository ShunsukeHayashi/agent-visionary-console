
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
  agents: Array<{ id: string; name: string; }>;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose, onUpdated, agents }) => {
  const queryClient = useQueryClient();
  
  // タスクの更新ミューテーション
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onUpdated();
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const classes = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };

    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${classes[priority as keyof typeof classes] || ""}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getAgentNameById = (agentId?: string) => {
    if (!agentId) return "未割り当て";
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : "未割り当て";
  };

  const updateTaskStatus = (status: string) => {
    updateTaskMutation.mutate({ 
      id: task.id, 
      status,
      progress: status === "completed" ? 100 : (status === "in-progress" ? 50 : task.progress)
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{task.name}</DialogTitle>
        <DialogDescription>
          タスクID: {typeof task.id === 'string' ? task.id.substring(0, 8) : task.id}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">ステータス</h4>
            <div className="flex items-center mt-1">
              {getStatusIcon(task.status)}
              <span className="ml-2 capitalize">
                {task.status === "completed" ? "完了" : 
                 task.status === "in-progress" ? "進行中" : "保留中"}
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">優先度</h4>
            <div className="mt-1">
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">説明</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {task.description || "説明なし"}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">担当エージェント</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {getAgentNameById(task.assigned_agent_id)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">期限</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {task.deadline ? new Date(task.deadline).toLocaleDateString('ja-JP') : "未設定"}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">進捗: {task.progress}%</h4>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                task.status === "completed" ? "bg-green-500" :
                task.status === "in-progress" ? "bg-blue-500" :
                "bg-amber-500"
              }`} 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => updateTaskStatus("pending")}
            disabled={task.status === "pending" || updateTaskMutation.isPending}
          >
            保留中に設定
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => updateTaskStatus("in-progress")}
            disabled={task.status === "in-progress" || updateTaskMutation.isPending}
          >
            進行中に設定
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => updateTaskStatus("completed")}
            disabled={task.status === "completed" || updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            完了に設定
          </Button>
        </div>
        <Button variant="outline" onClick={onClose}>
          閉じる
        </Button>
      </DialogFooter>
    </>
  );
};

export default TaskDetails;
