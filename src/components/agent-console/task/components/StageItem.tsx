
import React, { useState } from "react";
import { ThoughtStage, thoughtStageInfo } from "@/types/task";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Edit2, Save } from "lucide-react";

interface StageItemProps {
  stage: ThoughtStage;
  content: string | undefined;
  readOnly: boolean;
  editingStage: ThoughtStage | null;
  isSaving: boolean;
  onStartEditing: (stage: ThoughtStage) => void;
  onCancelEditing: () => void;
  onSaveContent: () => void;
  onContentChange: (content: string) => void;
  editedContent: string;
  className?: string;
  style?: React.CSSProperties;
}

const StageItem: React.FC<StageItemProps> = ({
  stage,
  content,
  readOnly,
  editingStage,
  isSaving,
  onStartEditing,
  onCancelEditing,
  onSaveContent,
  onContentChange,
  editedContent,
  className = "",
  style,
}) => {
  const getStageStatusIcon = () => {
    if (content) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div 
      className={`border rounded-md p-3 transition-all hover:shadow-sm ${
        content ? "bg-card" : "bg-muted/20"
      } ${className}`}
      style={style}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getStageStatusIcon()}
          <span className="font-medium text-primary/90">{thoughtStageInfo[stage].label}</span>
        </div>
        
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartEditing(stage)}
            disabled={editingStage !== null}
            className="transition-all hover:bg-primary/10"
          >
            <Edit2 className="h-4 w-4 text-primary/70" />
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
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[100px]"
            placeholder={`${thoughtStageInfo[stage].label}の内容を入力してください...`}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelEditing}
              disabled={isSaving}
              className="transition-all hover:bg-muted/20"
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              onClick={onSaveContent}
              disabled={isSaving}
              className="shadow-sm hover:shadow-md transition-all"
            >
              {isSaving ? "保存中..." : "保存"}
              {isSaving ? null : <Save className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-sm whitespace-pre-wrap">
          {content || (
            <span className="text-muted-foreground italic">内容がまだ入力されていません</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StageItem;
