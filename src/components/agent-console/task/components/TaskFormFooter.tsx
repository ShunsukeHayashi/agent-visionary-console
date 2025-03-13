
import React from "react";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TaskFormFooterProps {
  isSaving: boolean;
  onCancel: () => void;
}

const TaskFormFooter: React.FC<TaskFormFooterProps> = ({ isSaving, onCancel }) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        キャンセル
      </Button>
      <Button type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        タスクを作成
      </Button>
    </DialogFooter>
  );
};

export default TaskFormFooter;
