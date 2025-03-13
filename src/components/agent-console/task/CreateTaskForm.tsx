
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

type FormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  agents: Array<{ id: string; name: string; }>;
  projects: Array<{ id: string; title: string; }>;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ 
  onSuccess, 
  onCancel, 
  agents, 
  projects 
}) => {
  // タスクの作成ミューテーション
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: FormValues) => {
      // 必須フィールドの検証
      if (!newTask.name) {
        throw new Error("タスク名は必須です");
      }
      
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          name: newTask.name,
          description: newTask.description || null,
          status: newTask.status,
          priority: newTask.priority,
          assigned_agent_id: newTask.assigned_agent_id || null,
          deadline: newTask.deadline || null,
          project_id: newTask.project_id || null,
          progress: newTask.progress || 0
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0
    }
  });

  const onSubmit = (values: FormValues) => {
    createTaskMutation.mutate(values);
  };

  return (
    <>
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
                      {agents.length > 0 ? (
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
                      {projects.length > 0 ? (
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
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              タスクを作成
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default CreateTaskForm;
