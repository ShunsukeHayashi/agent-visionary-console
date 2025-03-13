export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string | null
          current_task: string | null
          description: string | null
          dynamic_generation: boolean | null
          element_chain: boolean | null
          id: string
          name: string
          performance: number | null
          project_id: string | null
          skills: Json | null
          status: string
          tools: string[] | null
          type: string
          updated_at: string | null
          uptime: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          current_task?: string | null
          description?: string | null
          dynamic_generation?: boolean | null
          element_chain?: boolean | null
          id: string
          name: string
          performance?: number | null
          project_id?: string | null
          skills?: Json | null
          status?: string
          tools?: string[] | null
          type: string
          updated_at?: string | null
          uptime?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          current_task?: string | null
          description?: string | null
          dynamic_generation?: boolean | null
          element_chain?: boolean | null
          id?: string
          name?: string
          performance?: number | null
          project_id?: string | null
          skills?: Json | null
          status?: string
          tools?: string[] | null
          type?: string
          updated_at?: string | null
          uptime?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      checkpoints: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          parameter_name: string
          parameter_value: string | null
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          parameter_name: string
          parameter_value?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          parameter_name?: string
          parameter_value?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkpoints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_transcripts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          meeting_date: string | null
          project_id: string | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          meeting_date?: string | null
          project_id?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          meeting_date?: string | null
          project_id?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_transcripts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_questions: {
        Row: {
          answer: string | null
          category: string
          created_at: string | null
          id: string
          importance: number | null
          project_id: string | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer?: string | null
          category: string
          created_at?: string | null
          id?: string
          importance?: number | null
          project_id?: string | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string | null
          category?: string
          created_at?: string | null
          id?: string
          importance?: number | null
          project_id?: string | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planning_questions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_agent_id: string | null
          checkpoint_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          meeting_transcript_id: string | null
          name: string
          planning_question_id: string | null
          priority: string
          progress: number
          project_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          checkpoint_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          meeting_transcript_id?: string | null
          name: string
          planning_question_id?: string | null
          priority?: string
          progress?: number
          project_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          checkpoint_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          meeting_transcript_id?: string | null
          name?: string
          planning_question_id?: string | null
          priority?: string
          progress?: number
          project_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_checkpoint_id_fkey"
            columns: ["checkpoint_id"]
            isOneToOne: false
            referencedRelation: "checkpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_meeting_transcript_id_fkey"
            columns: ["meeting_transcript_id"]
            isOneToOne: false
            referencedRelation: "meeting_transcripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_planning_question_id_fkey"
            columns: ["planning_question_id"]
            isOneToOne: false
            referencedRelation: "planning_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
