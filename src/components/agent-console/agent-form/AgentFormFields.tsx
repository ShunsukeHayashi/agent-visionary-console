
import React from "react";
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
  Layers
} from "lucide-react";

// Import the schema from a separate file
import { createAgentSchema } from "./agentFormSchema";

type FormValues = z.infer<typeof createAgentSchema>;

interface AgentFormFieldsProps {
  form: UseFormReturn<FormValues>;
  isDynamicGeneration: boolean;
}

const AgentFormFields: React.FC<AgentFormFieldsProps> = ({ form, isDynamicGeneration }) => {
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
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <>
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
    </>
  );
};

export default AgentFormFields;
