
import React from "react";
import { Sparkles } from "lucide-react";

interface TaskFormHeaderProps {
  isDynamicMode?: boolean;
  onToggleDynamicMode?: () => void;
}

const TaskFormHeader: React.FC<TaskFormHeaderProps> = ({ 
  isDynamicMode = false,
  onToggleDynamicMode
}) => {
  return (
    <div className="mb-6 pb-4 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">
          {isDynamicMode ? "ゴールから生成" : "新規タスク作成"}
        </h2>
        
        {onToggleDynamicMode && (
          <button
            type="button"
            onClick={onToggleDynamicMode}
            className="text-sm flex items-center px-2 py-1 rounded-md hover:bg-primary/5 text-primary transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {isDynamicMode ? "手動モードに戻る" : "ゴールから生成する"}
          </button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mt-1">
        {isDynamicMode 
          ? "ゴール（達成したい目標）を入力し、AIが適切なタスクを生成します。" 
          : "新しいタスクの詳細を入力してください。"}
      </p>
    </div>
  );
};

export default TaskFormHeader;
