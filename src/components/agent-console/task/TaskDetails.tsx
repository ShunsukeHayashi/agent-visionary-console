
import React, { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/Button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Plus, 
  Trash2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TaskBreakdown from "./TaskBreakdown";

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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">タスク名</Label>
            <Input 
              id="name" 
              name="name" 
              value={updatedTask.name} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={updatedTask.description || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select 
                value={updatedTask.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">保留中</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">優先度</Label>
              <Select 
                value={updatedTask.priority} 
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="優先度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="urgent">緊急</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_agent_id">担当エージェント</Label>
              <Select 
                value={updatedTask.assigned_agent_id || ''} 
                onValueChange={(value) => handleSelectChange('assigned_agent_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="エージェントを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">未割り当て</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">期限</Label>
              <div className="relative">
                <Input 
                  id="deadline" 
                  name="deadline" 
                  type="date" 
                  value={updatedTask.deadline?.split('T')[0] || ''} 
                  onChange={handleChange} 
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="progress">進捗 ({updatedTask.progress}%)</Label>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleProgressChange('decrease')}
                disabled={updatedTask.progress <= 0}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    updatedTask.status === 'completed' ? 'bg-green-500' :
                    updatedTask.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} 
                  style={{ width: `${updatedTask.progress}%` }}
                ></div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleProgressChange('increase')}
                disabled={updatedTask.progress >= 100}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 閲覧モード
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
      )}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setUpdatedTask({...task});
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button 
              onClick={saveChanges}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              編集
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
