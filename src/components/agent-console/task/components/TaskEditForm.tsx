
import React from "react";
import { Task } from "@/types/task";
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
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TaskEditFormProps {
  task: Task;
  agents: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleProgressChange: (direction: 'increase' | 'decrease') => void;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  agents,
  handleChange,
  handleSelectChange,
  handleProgressChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">タスク名</Label>
        <Input 
          id="name" 
          name="name" 
          value={task.name} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={task.description || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">ステータス</Label>
          <Select 
            value={task.status} 
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
            value={task.priority} 
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
            value={task.assigned_agent_id || ''} 
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
              value={task.deadline?.split('T')[0] || ''} 
              onChange={handleChange} 
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="progress">進捗 ({task.progress}%)</Label>
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleProgressChange('decrease')}
            disabled={task.progress <= 0}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 h-2 bg-muted rounded-full">
            <div 
              className={`h-2 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' :
                'bg-amber-500'
              }`} 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleProgressChange('increase')}
            disabled={task.progress >= 100}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditForm;
