
import React, { useState } from "react";
import { Task, ThoughtStage, thoughtStageInfo } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import StageItem from "./components/StageItem";
import ProgressBar from "./components/ProgressBar";

interface TaskBreakdownProps {
  task: Task;
  readOnly?: boolean;
  onTaskUpdated?: () => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ 
  task, 
  readOnly = false,
  onTaskUpdated 
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [editingStage, setEditingStage] = useState<ThoughtStage | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Order of stages following the framework flow
  const stageOrder: ThoughtStage[] = [
    "goal", 
    "definition", 
    "scenario", 
    "context", 
    "function", 
    "implementation", 
    "test_case", 
    "validation", 
    "deployment", 
    "result"
  ];

  const startEditing = (stage: ThoughtStage) => {
    setEditingStage(stage);
    setEditedContent(task[stage] || "");
  };

  const cancelEditing = () => {
    setEditingStage(null);
    setEditedContent("");
  };

  const saveStageContent = async () => {
    if (!editingStage) return;
    
    setIsSaving(true);
    
    try {
      const updates = {
        [editingStage]: editedContent,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", task.id);
        
      if (error) throw error;
      
      // Update local task object
      if (onTaskUpdated) onTaskUpdated();
      
      toast({
        title: "保存完了",
        description: `タスクの${thoughtStageInfo[editingStage].label}が更新されました`,
      });
      
      setEditingStage(null);
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "エラー",
        description: "タスクの更新中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCompletedStagesCount = () => {
    return stageOrder.filter(stage => !!task[stage]).length;
  };

  const completionPercentage = (getCompletedStagesCount() / stageOrder.length) * 100;

  return (
    <div className="border rounded-md p-4 mb-4">
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-medium">思考プロセスの分解</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {getCompletedStagesCount()}/{stageOrder.length} 完了
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ProgressBar value={getCompletedStagesCount()} max={stageOrder.length} />
              {isExpanded ? 
                <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              }
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            シュンスケ式思考プロセスフレームワーク G → Def → [Scn || Ctx] ⇒ Fn → Impl → TC ⇒ [Val && Deply] → Result に基づき、
            タスクを体系的に分解します。
          </div>
          
          {stageOrder.map((stage) => (
            <StageItem
              key={stage}
              stage={stage}
              content={task[stage]}
              readOnly={readOnly}
              editingStage={editingStage}
              isSaving={isSaving}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onSaveContent={saveStageContent}
              onContentChange={setEditedContent}
              editedContent={editedContent}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaskBreakdown;
