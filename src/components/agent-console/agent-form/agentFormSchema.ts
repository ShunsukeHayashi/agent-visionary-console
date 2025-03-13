
import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Agent name must be at least 2 characters" }),
  type: z.enum(["data", "customer-support", "document", "analytics", "marketing", "development", "multi-agent", "dynamic"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  context: z.string().optional(),
  dynamicGeneration: z.boolean().default(false),
  elementChain: z.boolean().default(false),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(100)
  })).optional(),
  tools: z.array(z.string()).optional(),
});

export type AgentFormValues = z.infer<typeof createAgentSchema>;
