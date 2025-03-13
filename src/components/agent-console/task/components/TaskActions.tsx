
import React from "react";
import { Button } from "@/components/ui/Button";

interface TaskActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
  onEdit: () => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  isEditing,
  isSaving,
  onSave,
  onCancel,
  onClose,
  onEdit
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving}
          >
            キャンセル
          </Button>
          <Button 
            onClick={onSave}
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
          <Button onClick={onEdit}>
            編集
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskActions;
