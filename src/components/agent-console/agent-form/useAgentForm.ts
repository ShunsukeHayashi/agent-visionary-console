
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createAgentSchema, AgentFormValues } from "./agentFormSchema";

interface UseAgentFormProps {
  onSubmit: (values: AgentFormValues) => void;
}

export const useAgentForm = ({ onSubmit }: UseAgentFormProps) => {
  const { toast } = useToast();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isGoalMode, setIsGoalMode] = useState(false);
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      type: "data",
      description: "",
      context: "",
      dynamicGeneration: false,
      elementChain: false,
      skills: [
        { name: "Natural Language Processing", level: 75 },
        { name: "Data Analysis", level: 60 }
      ],
      tools: [],
    },
  });

  const isDynamicGeneration = form.watch("dynamicGeneration");
  const isElementChain = form.watch("elementChain");

  const handleSubmit = (values: AgentFormValues) => {
    try {
      if (values.dynamicGeneration && values.description) {
        const contextWords = values.description.split(" ")
          .filter(word => word.length > 4)
          .slice(0, 2);
          
        if (contextWords.length > 0 && values.name.length < 5) {
          values.name = `${values.type.charAt(0).toUpperCase() + values.type.slice(1)} ${contextWords.join("-")}`;
        }
      }
      
      onSubmit(values);
      
      toast({
        title: "エージェント構成準備完了",
        description: values.dynamicGeneration 
          ? "コンテキストに基づいて動的エージェントが作成されます" 
          : "指定されたパラメータで新しいエージェントが作成されました",
      });
    } catch (error) {
      toast({
        title: "エージェント作成エラー",
        description: "エージェントの作成中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };
  
  const handleAgentGenerated = (agentData: any) => {
    form.reset({
      ...agentData,
      context: "",
      tools: []
    });
    setIsGoalMode(false);
  };
  
  const toggleGoalMode = () => {
    setIsGoalMode(!isGoalMode);
  };

  return {
    form,
    isGoalMode,
    isDynamicGeneration,
    isElementChain,
    showAdvancedOptions,
    handleSubmit,
    handleAgentGenerated,
    toggleGoalMode,
    setShowAdvancedOptions
  };
};
