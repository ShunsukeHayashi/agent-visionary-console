import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  BarChart, 
  Image, 
  FileText, 
  Code, 
  Database,
  Sparkles,
  Layers,
  Calculator,
  Workflow,
  Cog
} from "lucide-react";
import AgentAvatar from "../AgentAvatar";

// Import the schema from a separate file
import { createAgentSchema } from "./agentFormSchema";

type FormValues = z.infer<typeof createAgentSchema>;

interface AgentFormFieldsProps {
  form: UseFormReturn<FormValues>;
  isDynamicGeneration: boolean;
}

const AgentFormFields: React.FC<AgentFormFieldsProps> = ({ form, isDynamicGeneration }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  
  const agentName = form.watch("name");
  const agentType = form.watch("type");
  const agentDescription = form.watch("description");
  
  useEffect(() => {
    // Show avatar section when both name and type are provided
    if (agentName && agentName.length > 0 && agentType) {
      setShowAvatar(true);
    }
  }, [agentName, agentType]);

  const handleAvatarGenerated = (url: string) => {
    form.setValue("avatarUrl", url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "data":
        return <Database className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "customer-support":
        return <MessageSquare className="h-4 w-4" />;
      case "analytics":
        return <BarChart className="h-4 w-4" />;
      case "marketing":
        return <Image className="h-4 w-4" />;
      case "development":
        return <Code className="h-4 w-4" />;
      case "multi-agent":
        return <Layers className="h-4 w-4" />;
      case "dynamic":
        return <Sparkles className="h-4 w-4" />;
      case "payroll":
        return <Calculator className="h-4 w-4" />;
      case "workflow":
        return <Workflow className="h-4 w-4" />;
      case "automation":
        return <Cog className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-3/4 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Data Processor" {...field} />
                </FormControl>
                <FormDescription>
                  {isDynamicGeneration && "Name will be dynamically generated based on context"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="data">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        <span>Data Processor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="customer-support">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Customer Support</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Document Generator</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="analytics">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        <span>Analytics</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="marketing">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-2" />
                        <span>Marketing</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="development">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        <span>Development</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="multi-agent">
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-2" />
                        <span>Multi-Agent System</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dynamic">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span>Dynamic Agent</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="payroll">
                      <div className="flex items-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        <span>給与計算エージェント</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="workflow">
                      <div className="flex items-center">
                        <Workflow className="h-4 w-4 mr-2" />
                        <span>ワークフローエージェント</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="automation">
                      <div className="flex items-center">
                        <Cog className="h-4 w-4 mr-2" />
                        <span>自動化エージェント</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description/Context</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the agent's purpose or provide context for dynamic generation..."
                    className="resize-none h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {isDynamicGeneration && "This context will be used to dynamically generate the agent's capabilities"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />
        </div>
        
        {showAvatar && (
          <div className="w-full md:w-1/4 flex justify-center pt-6">
            <AgentAvatar 
              agentName={agentName}
              agentType={agentType}
              agentDescription={agentDescription}
              avatarUrl={form.watch("avatarUrl")}
              size="lg"
              showGenerateButton={true}
              onAvatarGenerated={handleAvatarGenerated}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AgentFormFields;
