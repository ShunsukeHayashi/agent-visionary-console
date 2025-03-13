
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";
import TaskToolbar from "./task/TaskToolbar";
import TaskListWrapper from "./task/TaskListWrapper";
import TaskDialog from "./task/TaskDialog";

const TaskManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();

  // タスク一覧の取得
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data as Task[];
    }
  });

  // エージェント一覧の取得
  const { data: agents, isLoading: isAgentsLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("id, name, type, status, description");
      
      if (error) {
        console.error("Error fetching agents:", error);
        throw error;
      }
      
      return data;
    }
  });

  // プロジェクト一覧の取得
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title");
      
      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
      
      return data;
    }
  });

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    filteredTasks,
    toggleSort
  } = useTaskFiltering(tasks);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleTaskCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setIsCreateDialogOpen(false);
    toast.success("タスクが正常に作成されました");
  };

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const closeTaskDetailsDialog = () => {
    setIsTaskDetailsDialogOpen(false);
  };

  const handleTaskUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast.success("タスクが正常に更新されました");
  };

  return (
    <div className="space-y-6">
      <DashboardCard>
        <TaskToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          openCreateDialog={openCreateDialog}
        />

        <TaskListWrapper
          isLoading={isTasksLoading}
          tasks={filteredTasks}
          sortBy={sortBy}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
          onViewDetails={viewTaskDetails}
          agents={agents || []}
        />
      </DashboardCard>

      <TaskDialog 
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isTaskDetailsDialogOpen={isTaskDetailsDialogOpen}
        setIsTaskDetailsDialogOpen={setIsTaskDetailsDialogOpen}
        selectedTask={selectedTask}
        handleTaskCreated={handleTaskCreated}
        handleTaskUpdated={handleTaskUpdated}
        closeCreateDialog={closeCreateDialog}
        closeTaskDetailsDialog={closeTaskDetailsDialog}
        agents={agents || []}
        projects={projects || []}
      />
    </div>
  );
};

export default TaskManager;
