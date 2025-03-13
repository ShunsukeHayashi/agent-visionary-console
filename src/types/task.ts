
export interface Task {
  id: string;
  title?: string; // For backward compatibility
  name?: string; // From database
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  deadline?: string; // From database
  assigned_to?: string;
  assigned_agent_id?: string; // From database
  project_id?: string;
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  progress?: number;
  stage?: string;
  requires_human_intervention?: boolean;
  human_intervention_type?: 'review' | 'approval' | 'manual' | 'intervention';
  
  // Thought stage fields for task breakdown
  goal?: string;
  definition?: string;
  scenario?: string;
  context?: string;
  function?: string;
  implementation?: string;
  test_case?: string;
  validation?: string;
  deployment?: string;
  result?: string;
  
  // Additional fields from database
  checkpoint_id?: string;
  planning_question_id?: string;
  meeting_transcript_id?: string;
}

// Define ThoughtStage type
export type ThoughtStage = 
  | 'goal'
  | 'definition'
  | 'scenario'
  | 'context'
  | 'function'
  | 'implementation'
  | 'test_case'
  | 'validation'
  | 'deployment'
  | 'result';

// Define thoughtStageInfo object
export const thoughtStageInfo: Record<ThoughtStage, { label: string; description: string }> = {
  goal: {
    label: '目標定義',
    description: 'このタスクの目標は何か？達成すべき成果は？'
  },
  definition: {
    label: '問題定義',
    description: '解決すべき問題や課題は何か？'
  },
  scenario: {
    label: 'シナリオ',
    description: 'どのようなシナリオで動作する必要があるか？'
  },
  context: {
    label: 'コンテキスト',
    description: 'このタスクを取り巻く背景情報や考慮すべき制約は？'
  },
  function: {
    label: '機能要件',
    description: 'どのような機能を実装する必要があるか？'
  },
  implementation: {
    label: '実装計画',
    description: 'どのように実装するか？必要なステップは？'
  },
  test_case: {
    label: 'テストケース',
    description: '正しく機能していることを確認するためのテスト方法は？'
  },
  validation: {
    label: '検証基準',
    description: 'タスクが正常に完了したことをどのように検証するか？'
  },
  deployment: {
    label: 'デプロイ計画',
    description: '成果物をどのようにデプロイまたは提供するか？'
  },
  result: {
    label: '結果',
    description: 'タスクの結果と学びは何か？'
  }
};
