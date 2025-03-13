
export type Task = {
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
