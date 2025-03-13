
import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Agent name must be at least 2 characters" }),
  type: z.enum([
    "data", 
    "customer-support", 
    "document", 
    "analytics", 
    "marketing", 
    "development", 
    "multi-agent", 
    "dynamic",
    "payroll", // 給与計算エージェント
    "workflow", // ワークフローエージェント
    "automation" // 自動化エージェント
  ]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  context: z.string().optional(),
  dynamicGeneration: z.boolean().default(false),
  elementChain: z.boolean().default(false),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(100)
  })).optional(),
  tools: z.array(z.string()).optional(),
  // 新しいAPIツール定義
  apiTools: z.array(z.object({
    name: z.string(),
    endpoint: z.string().optional(),
    description: z.string().optional(),
    auth: z.boolean().default(false),
    parameters: z.array(z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean().default(false),
      description: z.string().optional()
    })).optional()
  })).optional(),
  // 新しい関数ツール定義
  functionTools: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    input: z.string().optional(),
    output: z.string().optional(),
    code: z.string().optional()
  })).optional(),
  // ワークフロー用のタスク情報
  workflow: z.object({
    steps: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      isAutomated: z.boolean().default(false),
      assignedTo: z.string().optional(),
      toolRequired: z.string().optional(),
      expectedDuration: z.number().optional() // minutes
    })).optional()
  }).optional(),
  // エージェント画像URL
  avatarUrl: z.string().optional()
});

export type AgentFormValues = z.infer<typeof createAgentSchema>;
