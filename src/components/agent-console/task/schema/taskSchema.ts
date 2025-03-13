
import { z } from "zod";

// タスク作成フォームのスキーマ
export const taskFormSchema = z.object({
  name: z.string().min(1, { message: "タスク名は必須です" }),
  description: z.string().optional(),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  assigned_agent_id: z.string().optional(),
  deadline: z.string().optional(),
  project_id: z.string().optional(),
  progress: z.number().default(0)
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
