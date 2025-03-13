
import React, { useState } from "react";
import { Task } from "@/types/task";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TaskBreakdown from "./TaskBreakdown";
import TaskBasicInfo from "./components/TaskBasicInfo";
import TaskEditForm from "./components/TaskEditForm";
import TaskActions from "./components/TaskActions";

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
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUpdatedTask(prev => ({ ...prev, [name]: value }));
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

  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updatedTask,
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
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>タスク詳細</DialogTitle>
        <DialogDescription>
          ID: {task.id}
        </DialogDescription>
      </DialogHeader>

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
          task={task}
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
