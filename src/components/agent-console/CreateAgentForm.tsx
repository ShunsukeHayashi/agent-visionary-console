
import React from "react";
import { Form } from "@/components/ui/form";
import DynamicAgentGenerator from "./DynamicAgentGenerator";
import { useAgentForm } from "./agent-form/useAgentForm";
import AgentFormHeader from "./agent-form/AgentFormHeader";
import AgentFormFields from "./agent-form/AgentFormFields";
import AgentAdvancedOptions from "./agent-form/AgentAdvancedOptions";
import AgentFormFooter from "./agent-form/AgentFormFooter";
import { AgentFormValues } from "./agent-form/agentFormSchema";

interface CreateAgentFormProps {
  onSubmit: (values: AgentFormValues) => void;
  onCancel: () => void;
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSubmit, onCancel }) => {
  const {
    form,
    isGoalMode,
    isDynamicGeneration,
    showAdvancedOptions,
    handleSubmit,
    handleAgentGenerated,
    toggleGoalMode,
    setShowAdvancedOptions
  } = useAgentForm({ onSubmit });

  return (
    <>
      <AgentFormHeader 
        isGoalMode={isGoalMode} 
        toggleGoalMode={toggleGoalMode} 
      />
    
      {isGoalMode ? (
        <DynamicAgentGenerator onAgentGenerated={handleAgentGenerated} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <AgentFormFields 
              form={form} 
              isDynamicGeneration={isDynamicGeneration} 
            />

            <AgentAdvancedOptions 
              form={form}
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
            />

            <AgentFormFooter 
              onCancel={onCancel}
              isDynamicGeneration={isDynamicGeneration}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateAgentForm;
