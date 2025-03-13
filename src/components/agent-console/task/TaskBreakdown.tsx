
import React, { useState } from "react";
import { Task, ThoughtStage, thoughtStageInfo } from "@/types/task";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ChevronDown, ChevronUp, Edit2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  const getStageStatusIcon = (stage: ThoughtStage) => {
    if (task[stage]) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
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
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
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
            <div 
              key={stage} 
              className={`border rounded-md p-3 ${
                task[stage] ? "bg-card" : "bg-muted/20"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getStageStatusIcon(stage)}
                  <span className="font-medium">{thoughtStageInfo[stage].label}</span>
                </div>
                
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(stage)}
                    disabled={editingStage !== null}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {thoughtStageInfo[stage].description}
              </p>
              
              {editingStage === stage ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[100px]"
                    placeholder={`${thoughtStageInfo[stage].label}の内容を入力してください...`}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      キャンセル
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveStageContent}
                      disabled={isSaving}
                    >
                      {isSaving ? "保存中..." : "保存"}
                      {isSaving ? null : <Save className="ml-1 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm whitespace-pre-wrap">
                  {task[stage] || (
                    <span className="text-muted-foreground italic">内容がまだ入力されていません</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaskBreakdown;
