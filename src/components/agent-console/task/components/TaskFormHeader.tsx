
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const TaskFormHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle>新規タスクの作成</DialogTitle>
      <DialogDescription>
        AIエージェントに割り当てるタスクの詳細を入力してください
      </DialogDescription>
    </DialogHeader>
  );
};

export default TaskFormHeader;
