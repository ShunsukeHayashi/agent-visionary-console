
import React from "react";
import { Loader2 } from "lucide-react";
import TaskList from "./TaskList";
import { Task } from "@/types/task";

interface TaskListWrapperProps {
  isLoading: boolean;
  tasks: Task[];
  sortBy: string;
  sortOrder: string;
  toggleSort: (field: string) => void;
  onViewDetails: (task: Task) => void;
  agents: any[];
}

const TaskListWrapper: React.FC<TaskListWrapperProps> = ({
  isLoading,
  tasks,
  sortBy,
  sortOrder,
  toggleSort,
  onViewDetails,
  agents,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">タスクを読み込み中...</span>
      </div>
    );
  }

  return (
    <TaskList
      tasks={tasks}
      toggleSort={toggleSort}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onViewDetails={onViewDetails}
      agents={agents}
    />
  );
};

export default TaskListWrapper;
