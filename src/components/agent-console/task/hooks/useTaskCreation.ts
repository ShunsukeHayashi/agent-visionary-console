
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskFormValues } from "../schema/taskSchema";

export const useTaskCreation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (newTask: TaskFormValues) => {
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
    onSuccess,
    onError: (error) => {
      console.error("Error creating task:", error);
    }
  });
};
