
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import TaskList from "@/components/agent-console/task/TaskList";
import TaskDetails from "@/components/agent-console/task/TaskDetails";
import CreateTaskForm from "@/components/agent-console/task/CreateTaskForm";
import { Task } from "@/types/task";

const TaskManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
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

  const filteredTasks = tasks
    ? tasks
      .filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             task.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // ソート用の比較関数
        const aValue = a[sortBy as keyof Task];
        const bValue = b[sortBy as keyof Task];
        
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortOrder === "asc" ? -1 : 1;
        if (!bValue) return sortOrder === "asc" ? 1 : -1;
        
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

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
    setIsTaskDetailsDialogOpen(false);
    toast.success("タスクが正常に更新されました");
  };

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <h2 className="text-lg font-semibold">タスク管理</h2>
          <Button variant="primary" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            新規タスク
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="w-full md:w-auto relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="タスクを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                  {statusFilter === "all" ? "すべてのステータス" : 
                   statusFilter === "completed" ? "完了" :
                   statusFilter === "in-progress" ? "進行中" : "保留中"}
                  <Filter className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>すべてのステータス</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>完了</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>進行中</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>保留中</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isTasksLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">タスクを読み込み中...</span>
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks} 
            toggleSort={toggleSort} 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            onViewDetails={viewTaskDetails}
            agents={agents || []}
          />
        )}
      </DashboardCard>

      {/* 新規タスク作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
        <DialogContent className="sm:max-w-[500px]">
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
    </div>
  );
};

export default TaskManager;
