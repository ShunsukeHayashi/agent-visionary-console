
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter, ArrowDown, ArrowUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// タスクのタイプ定義
type Task = {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  assigned_agent_id?: string;
  deadline?: string;
  project_id?: string;
  meeting_transcript_id?: string;
  planning_question_id?: string;
  checkpoint_id?: string;
  progress: number;
  created_at?: string;
  updated_at?: string;
};

// エージェントのタイプ定義
type Agent = {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
};

// プロジェクトのタイプ定義
type Project = Tables<"projects">;

// タスク作成フォームのスキーマ
const taskFormSchema = z.object({
  name: z.string().min(1, { message: "タスク名は必須です" }),
  description: z.string().optional(),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  assigned_agent_id: z.string().optional(),
  deadline: z.string().optional(),
  project_id: z.string().optional(),
  progress: z.number().default(0)
});

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
      
      return data as Agent[];
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
      
      return data as Project[];
    }
  });

  // タスクの作成ミューテーション
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: z.infer<typeof taskFormSchema>) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreateDialogOpen(false);
      toast.success("タスクが正常に作成されました");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("タスクの作成に失敗しました");
    }
  });

  // タスクの更新ミューテーション
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsTaskDetailsDialogOpen(false);
      toast.success("タスクが正常に更新されました");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error("タスクの更新に失敗しました");
    }
  });

  // タスク作成フォーム
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const classes = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };

    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${classes[priority as keyof typeof classes] || ""}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const openCreateDialog = () => {
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof taskFormSchema>) => {
    createTaskMutation.mutate(data);
  };

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const updateTaskStatus = (id: string, status: string) => {
    updateTaskMutation.mutate({ id, status });
  };

  const getAgentNameById = (agentId?: string) => {
    if (!agentId || !agents) return "未割り当て";
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : "未割り当て";
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
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" 
                      onClick={() => toggleSort("id")}>
                    <div className="flex items-center">
                      タスクID
                      {sortBy === "id" && (
                        sortOrder === "asc" ? 
                        <ArrowUp className="h-4 w-4 ml-1" /> : 
                        <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("name")}>
                    <div className="flex items-center">
                      タスク名
                      {sortBy === "name" && (
                        sortOrder === "asc" ? 
                        <ArrowUp className="h-4 w-4 ml-1" /> : 
                        <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("status")}>
                    <div className="flex items-center">
                      ステータス
                      {sortBy === "status" && (
                        sortOrder === "asc" ? 
                        <ArrowUp className="h-4 w-4 ml-1" /> : 
                        <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("priority")}>
                    <div className="flex items-center">
                      優先度
                      {sortBy === "priority" && (
                        sortOrder === "asc" ? 
                        <ArrowUp className="h-4 w-4 ml-1" /> : 
                        <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">担当エージェント</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("deadline")}>
                    <div className="flex items-center">
                      期限
                      {sortBy === "deadline" && (
                        sortOrder === "asc" ? 
                        <ArrowUp className="h-4 w-4 ml-1" /> : 
                        <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">進捗</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => viewTaskDetails(task)}
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{task.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{task.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          {getStatusIcon(task.status)}
                          <span className="ml-2 capitalize">
                            {task.status === "completed" ? "完了" : 
                             task.status === "in-progress" ? "進行中" : "保留中"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{getAgentNameById(task.assigned_agent_id)}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('ja-JP') : "未設定"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              task.status === "completed" ? "bg-green-500" :
                              task.status === "in-progress" ? "bg-blue-500" :
                              "bg-amber-500"
                            }`} 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{task.progress}%</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      {searchTerm || statusFilter !== "all" 
                        ? "検索条件に一致するタスクがありません" 
                        : "タスクがありません。「新規タスク」ボタンから作成してください"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {/* 新規タスク作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新規タスクの作成</DialogTitle>
            <DialogDescription>
              AIエージェントに割り当てるタスクの詳細を入力してください
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タスク名</FormLabel>
                    <FormControl>
                      <Input placeholder="タスク名を入力" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="タスクの詳細を入力"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>優先度</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="優先度を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ステータス</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="ステータスを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">保留中</SelectItem>
                          <SelectItem value="in-progress">進行中</SelectItem>
                          <SelectItem value="completed">完了</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assigned_agent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>担当エージェント</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="担当者を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isAgentsLoading ? (
                            <SelectItem value="" disabled>読み込み中...</SelectItem>
                          ) : agents && agents.length > 0 ? (
                            agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>利用可能なエージェントがありません</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>プロジェクト</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="プロジェクトを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isProjectsLoading ? (
                            <SelectItem value="" disabled>読み込み中...</SelectItem>
                          ) : projects && projects.length > 0 ? (
                            projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>プロジェクトがありません</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期限</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={createTaskMutation.isPending}>
                  {createTaskMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  タスクを作成
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* タスク詳細ダイアログ */}
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={setIsTaskDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.name}</DialogTitle>
                <DialogDescription>
                  タスクID: {selectedTask.id.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">ステータス</h4>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedTask.status)}
                      <span className="ml-2 capitalize">
                        {selectedTask.status === "completed" ? "完了" : 
                         selectedTask.status === "in-progress" ? "進行中" : "保留中"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">優先度</h4>
                    <div className="mt-1">
                      {getPriorityBadge(selectedTask.priority)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">説明</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTask.description || "説明なし"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">担当エージェント</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getAgentNameById(selectedTask.assigned_agent_id)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">期限</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString('ja-JP') : "未設定"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">進捗: {selectedTask.progress}%</h4>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedTask.status === "completed" ? "bg-green-500" :
                        selectedTask.status === "in-progress" ? "bg-blue-500" :
                        "bg-amber-500"
                      }`} 
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateTaskStatus(selectedTask.id, "pending")}
                    disabled={selectedTask.status === "pending" || updateTaskMutation.isPending}
                  >
                    保留中に設定
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateTaskStatus(selectedTask.id, "in-progress")}
                    disabled={selectedTask.status === "in-progress" || updateTaskMutation.isPending}
                  >
                    進行中に設定
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => updateTaskStatus(selectedTask.id, "completed")}
                    disabled={selectedTask.status === "completed" || updateTaskMutation.isPending}
                  >
                    完了に設定
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsTaskDetailsDialogOpen(false)}>
                  閉じる
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;
