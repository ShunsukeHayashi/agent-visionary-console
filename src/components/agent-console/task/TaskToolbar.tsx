
import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import TaskSearch from "./TaskSearch";
import TaskFilter from "./TaskFilter";

interface TaskToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  openCreateDialog: () => void;
}

const TaskToolbar: React.FC<TaskToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  openCreateDialog,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <h2 className="text-lg font-semibold">タスク管理</h2>
        <Button variant="primary" onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          新規タスク
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <TaskSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TaskFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>
    </>
  );
};

export default TaskToolbar;
