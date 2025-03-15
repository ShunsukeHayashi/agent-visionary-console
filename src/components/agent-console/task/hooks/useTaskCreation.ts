
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskFormValues } from "../schema/taskSchema";
import { ThoughtStage, thoughtStageInfo } from "@/types/task";

// TaskFormValuesを拡張して思考ステージを含める型
export interface TaskWithThoughtStages extends TaskFormValues {
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
}

// デモモード用のローカルストレージキー
const DEMO_TASKS_KEY = 'demo_tasks';

// デモモード用のタスクを保存する関数
const saveDemoTask = (task: any) => {
  try {
    // 既存のタスクを取得
    const tasksJson = localStorage.getItem(DEMO_TASKS_KEY) || '[]';
    const tasks = JSON.parse(tasksJson);
    
    // 新しいタスクにIDと日時を追加
    const newTask = {
      ...task,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // タスクを追加して保存
    tasks.push(newTask);
    localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
    
    return [newTask];
  } catch (error) {
    console.error('Error saving demo task:', error);
    throw error;
  }
};

export const useTaskCreation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (newTask: TaskWithThoughtStages) => {
      // 必須フィールドの検証
      if (!newTask.name) {
        throw new Error("タスク名は必須です");
      }
      
      try {
        // まずSupabaseでの保存を試みる
        let projectId = newTask.project_id;
        
        if (!projectId) {
          // プロジェクトが指定されていない場合、ユーザーの最初のプロジェクトを使用
          const { data: projects, error: projectError } = await supabase
            .from("projects")
            .select("id")
            .limit(1);
          
          if (projectError) {
            console.error("Error fetching projects:", projectError);
          } else if (projects && projects.length > 0) {
            projectId = projects[0].id;
          } else {
            // プロジェクトが見つからない場合、デフォルトプロジェクトを作成
            console.log("No projects found, creating a default project");
            
            // 現在のユーザーIDを取得
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;
            
            console.log("Current user ID:", userId);
            
            const { data: newProject, error: createError } = await supabase
              .from("projects")
              .insert({
                title: "デフォルトプロジェクト",
                description: "自動生成されたデフォルトプロジェクト",
                status: "active",
                user_id: userId // 明示的にユーザーIDを設定
              })
              .select();
            
            if (createError) {
              console.error("Error creating default project:", createError);
            } else if (newProject && newProject.length > 0) {
              projectId = newProject[0].id;
              console.log("Created default project with ID:", projectId);
            }
          }
        }
        
        // 基本的なタスクデータを作成
        const taskData = {
          name: newTask.name,
          description: newTask.description || null,
          status: newTask.status,
          priority: newTask.priority,
          assigned_agent_id: newTask.assigned_agent_id || null,
          deadline: newTask.deadline || null,
          project_id: projectId,
          progress: newTask.progress || 0
          
          // 思考ステージのデータは一時的に無効化
          // データベースにカラムが追加されるまでコメントアウト
          /*
          goal: newTask.goal || null,
          definition: newTask.definition || null,
          scenario: newTask.scenario || null,
          context: newTask.context || null,
          function: newTask.function || null,
          implementation: newTask.implementation || null,
          test_case: newTask.test_case || null,
          validation: newTask.validation || null,
          deployment: newTask.deployment || null,
          result: newTask.result || null
          */
        };
        
        const { data, error } = await supabase
          .from("tasks")
          .insert(taskData)
          .select();
        
        if (error) {
          // Supabaseでのエラーが発生した場合、デモモードにフォールバック
          console.warn("Falling back to demo mode due to Supabase error:", error);
          return saveDemoTask(taskData);
        }
        
        return data;
      } catch (error) {
        // エラーが発生した場合、デモモードにフォールバック
        console.warn("Falling back to demo mode due to error:", error);
        
        // 基本的なタスクデータを作成
        const taskData = {
          name: newTask.name,
          description: newTask.description || null,
          status: newTask.status,
          priority: newTask.priority,
          progress: newTask.progress || 0
        };
        
        return saveDemoTask(taskData);
      }
    },
    onSuccess,
    onError: (error) => {
      console.error("Error creating task:", error);
    }
  });
};
