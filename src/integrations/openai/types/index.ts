/**
 * Agent data interface
 */
export interface AgentData {
  name: string;
  type: string;
  description: string;
  dynamicGeneration: boolean;
  elementChain?: boolean;
  skills: Array<{
    name: string;
    level: number;
  }>;
  metadata?: Record<string, unknown>;
}

/**
 * Thinking step interface
 */
export interface ThinkingStep {
  id: string;
  type: 'goal' | 'backward' | 'forward' | 'result' | 'flowchart';
  content: string;
  completed: boolean;
  timestamp: number;
}

/**
 * Agent progress event types
 */
export type AgentProgressEventType = 'thinking' | 'processing' | 'complete' | 'error';

/**
 * Agent progress event interface
 */
export interface AgentProgressEvent {
  type: AgentProgressEventType;
  message: string;
  progress?: number;
  data?: Record<string, unknown>;
}

/**
 * Agent result interface
 */
export interface AgentResult {
  content: string;
  status: 'completed' | 'failed' | 'requires_action';
  metadata?: Record<string, unknown>;
}
