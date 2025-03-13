
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      {/* 新規タスク作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] w-[90vw] max-h-[90vh] overflow-y-auto">
          <CreateTaskForm 
            onCancel={closeCreateDialog} 
            onSuccess={handleTaskCreated}
            agents={agents || []} 
            projects={projects || []}
          />
        </DialogContent>
      </Dialog>

      {/* タスク詳細ダイアログ */}
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={setIsTaskDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] w-[90vw] max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <TaskDetails 
              task={selectedTask} 
              onClose={closeTaskDetailsDialog} 
              onUpdated={handleTaskUpdated}
              agents={agents || []}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDialog;
