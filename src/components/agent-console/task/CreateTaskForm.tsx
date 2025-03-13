
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { taskFormSchema, TaskFormValues } from "./schema/taskSchema";
import { useTaskCreation } from "./hooks/useTaskCreation";
import TaskFormHeader from "./components/TaskFormHeader";
import TaskFormFields from "./components/TaskFormFields";
import TaskFormFooter from "./components/TaskFormFooter";

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

  return (
    <>
      <TaskFormHeader />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TaskFormFields form={form} agents={agents} projects={projects} />
          
          <TaskFormFooter 
            isSaving={createTaskMutation.isPending} 
            onCancel={onCancel} 
          />
        </form>
      </Form>
    </>
  );
};

export default CreateTaskForm;
