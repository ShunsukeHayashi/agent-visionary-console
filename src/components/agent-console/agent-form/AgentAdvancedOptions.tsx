
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { createAgentSchema } from "./agentFormSchema";

type FormValues = z.infer<typeof createAgentSchema>;

interface AgentAdvancedOptionsProps {
  form: UseFormReturn<FormValues>;
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (show: boolean) => void;
}

const AgentAdvancedOptions: React.FC<AgentAdvancedOptionsProps> = ({
  form,
  showAdvancedOptions,
  setShowAdvancedOptions
}) => {
  const isElementChain = form.watch("elementChain");

  return (
    <div className="pt-2 border-t border-border/50">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Advanced Options</span>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          {showAdvancedOptions ? "Hide" : "Show"}
        </Button>
      </div>
      
      {showAdvancedOptions && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dynamicGeneration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Dynamic Generation</FormLabel>
                  <FormDescription>
                    Generate agent capabilities dynamically from context
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="elementChain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Element Chain Execution</FormLabel>
                  <FormDescription>
                    Execute tasks using element chain methodology
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {isElementChain && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground">
                Element Chain will process context through multiple AI stages, breaking tasks into discrete elements that can be executed sequentially.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentAdvancedOptions;
