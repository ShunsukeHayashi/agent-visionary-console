
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Task } from "@/types/task";
import TaskDetails from "./TaskDetails";
import CreateTaskForm from "./CreateTaskForm";

interface TaskDialogProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isTaskDetailsDialogOpen: boolean;
  setIsTaskDetailsDialogOpen: (open: boolean) => void;
  selectedTask: Task | null;
  handleTaskCreated: () => void;
  handleTaskUpdated: () => void;
  closeCreateDialog: () => void;
  closeTaskDetailsDialog: () => void;
  agents: any[];
  projects: any[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isTaskDetailsDialogOpen,
  setIsTaskDetailsDialogOpen,
  selectedTask,
  handleTaskCreated,
  handleTaskUpdated,
  closeCreateDialog,
  closeTaskDetailsDialog,
  agents,
  projects,
}) => {
  return (
    <>
      {/* 新規タスク作成シート */}
      <Sheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <SheetContent side="bottom" className="h-[90vh] w-full sm:max-w-full overflow-y-auto">
          <CreateTaskForm 
            onCancel={closeCreateDialog} 
            onSuccess={handleTaskCreated}
            agents={agents || []} 
            projects={projects || []}
          />
        </SheetContent>
      </Sheet>

      {/* タスク詳細シート */}
      <Sheet open={isTaskDetailsDialogOpen} onOpenChange={setIsTaskDetailsDialogOpen}>
        <SheetContent side="bottom" className="h-[90vh] w-full sm:max-w-full overflow-y-auto">
          {selectedTask && (
            <TaskDetails 
              task={selectedTask} 
              onClose={closeTaskDetailsDialog} 
              onUpdated={handleTaskUpdated}
              agents={agents || []}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TaskDialog;
