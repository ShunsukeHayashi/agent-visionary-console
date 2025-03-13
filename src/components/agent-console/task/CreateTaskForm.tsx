
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { taskFormSchema, TaskFormValues } from "./schema/taskSchema";
import { useTaskCreation } from "./hooks/useTaskCreation";
import TaskFormHeader from "./components/TaskFormHeader";
import TaskFormFields from "./components/TaskFormFields";
import TaskFormFooter from "./components/TaskFormFooter";
import DynamicTaskGenerator from "./components/DynamicTaskGenerator";

interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  agents: Array<{ id: string; name: string; }>;
  projects: Array<{ id: string; title: string; }>;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ 
  onSuccess, 
  onCancel, 
  agents, 
  projects 
}) => {
  const [isDynamicMode, setIsDynamicMode] = useState(false);
  
  // タスクの作成ミューテーション
  const createTaskMutation = useTaskCreation(onSuccess);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0
    }
  });

  const onSubmit = (values: TaskFormValues) => {
    createTaskMutation.mutate(values);
  };
  
  const handleTaskGenerated = (taskData: Partial<TaskFormValues>) => {
    // フォームの値をリセットして、生成されたタスクデータを設定
    form.reset(taskData);
    // 動的モードから手動モードに切り替え
    setIsDynamicMode(false);
  };
  
  const toggleDynamicMode = () => {
    setIsDynamicMode(!isDynamicMode);
  };

  return (
    <>
      <TaskFormHeader 
        isDynamicMode={isDynamicMode}
        onToggleDynamicMode={toggleDynamicMode}
      />
      
      {isDynamicMode ? (
        <DynamicTaskGenerator onTaskGenerated={handleTaskGenerated} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TaskFormFields form={form} agents={agents} projects={projects} />
            
            <TaskFormFooter 
              isSaving={createTaskMutation.isPending} 
              onCancel={onCancel} 
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateTaskForm;
