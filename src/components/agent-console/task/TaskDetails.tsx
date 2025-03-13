
import React, { useState } from "react";
import { Task } from "@/types/task";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TaskBreakdown from "./TaskBreakdown";
import TaskBasicInfo from "./components/TaskBasicInfo";
import TaskEditForm from "./components/TaskEditForm";
import TaskActions from "./components/TaskActions";
import HumanTaskIndicator from "./components/HumanTaskIndicator";
import { HandMetal, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
  agents: any[];
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ 
  task, 
  onClose, 
  onUpdated,
  agents
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task>({...task});
  const [isSaving, setIsSaving] = useState(false);
  const [requiresHumanIntervention, setRequiresHumanIntervention] = useState(
    task.requires_human_intervention || false
  );
  const [humanInterventionType, setHumanInterventionType] = useState(
    task.human_intervention_type || "review"
  );
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUpdatedTask(prev => ({ ...prev, [name]: value }));
    
    // 人間介入タイプの更新
    if (name === "human_intervention_type") {
      setHumanInterventionType(value);
    }
  };

  const handleProgressChange = (direction: 'increase' | 'decrease') => {
    let newProgress = updatedTask.progress;
    
    if (direction === 'increase' && newProgress < 100) {
      newProgress += 10;
    } else if (direction === 'decrease' && newProgress > 0) {
      newProgress -= 10;
    }
    
    setUpdatedTask(prev => ({ ...prev, progress: newProgress }));
  };

  const handleHumanInterventionToggle = (checked: boolean) => {
    setRequiresHumanIntervention(checked);
    setUpdatedTask(prev => ({ 
      ...prev, 
      requires_human_intervention: checked
    }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updatedTask,
          requires_human_intervention: requiresHumanIntervention,
          human_intervention_type: humanInterventionType,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      onUpdated();
      
      toast({
        title: "Task updated",
        description: "タスクが正常に更新されました"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "タスクの更新中にエラーが発生しました",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "未設定";
    return new Date(dateString).toLocaleDateString();
  };

  const handleCancel = () => {
    setUpdatedTask({...task});
    setRequiresHumanIntervention(task.requires_human_intervention || false);
    setHumanInterventionType(task.human_intervention_type || "review");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>タスク詳細</DialogTitle>
          {requiresHumanIntervention && !isEditing && (
            <HumanTaskIndicator 
              type={humanInterventionType as "review" | "approval" | "manual" | "intervention"} 
            />
          )}
        </div>
        <DialogDescription>
          ID: {task.id}
        </DialogDescription>
      </DialogHeader>

      {/* 人間介入設定（編集モード時のみ表示） */}
      {isEditing && (
        <div className="bg-muted/20 p-3 rounded-md border border-muted">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <HandMetal className="h-4 w-4 mr-2 text-purple-600" />
              <h3 className="text-sm font-medium">ヒューマンインザループ設定</h3>
            </div>
            <Switch 
              checked={requiresHumanIntervention}
              onCheckedChange={handleHumanInterventionToggle}
            />
          </div>
          
          {requiresHumanIntervention && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="human_intervention_type" className="text-xs">介入タイプ</Label>
                <select
                  id="human_intervention_type"
                  className="w-full mt-1 rounded-md border border-input px-3 py-1 text-sm"
                  value={humanInterventionType}
                  onChange={(e) => handleSelectChange("human_intervention_type", e.target.value)}
                >
                  <option value="review">要確認（レビュー）</option>
                  <option value="approval">承認必要</option>
                  <option value="manual">手動処理</option>
                  <option value="intervention">その他介入</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <div className="bg-purple-50 p-2 rounded-md border border-purple-100 mt-4 w-full">
                  <div className="flex items-center text-xs text-purple-700">
                    <Sparkles className="h-3.5 w-3.5 mr-1 text-purple-500" />
                    <span>人間の判断や作業が必要なタスク</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* タスクの思考プロセス分解 */}
      <TaskBreakdown 
        task={task} 
        readOnly={!isEditing} 
        onTaskUpdated={onUpdated}
      />

      {isEditing ? (
        // 編集モード
        <TaskEditForm 
          task={updatedTask}
          agents={agents}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleProgressChange={handleProgressChange}
        />
      ) : (
        // 閲覧モード
        <TaskBasicInfo 
          task={{
            ...task,
            requires_human_intervention: requiresHumanIntervention,
            human_intervention_type: humanInterventionType
          }}
          agents={agents}
          formatDate={formatDate}
        />
      )}
      
      <TaskActions 
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={saveChanges}
        onCancel={handleCancel}
        onClose={onClose}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
};

export default TaskDetails;
