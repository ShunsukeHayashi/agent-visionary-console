export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
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
}
