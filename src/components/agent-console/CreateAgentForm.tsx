import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/Button";
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
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import DynamicAgentGenerator from "./DynamicAgentGenerator";

// Define the schema for agent creation
const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Agent name must be at least 2 characters" }),
  type: z.enum(["data", "customer-support", "document", "analytics", "marketing", "development", "multi-agent", "dynamic"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  context: z.string().optional(),
  dynamicGeneration: z.boolean().default(false),
  elementChain: z.boolean().default(false),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(100)
  })).optional(),
  tools: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof createAgentSchema>;

interface CreateAgentFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isGoalMode, setIsGoalMode] = useState(false);
  
  const form = useForm<FormValues>({
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

  const handleSubmit = (values: FormValues) => {
    try {
      // If dynamic generation is enabled, generate a more descriptive name
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
        title: "Agent configuration ready",
        description: values.dynamicGeneration 
          ? "Dynamic agent will be created based on context" 
          : "New agent created with specified parameters",
      });
    } catch (error) {
      toast({
        title: "Error creating agent",
        description: "There was an error creating the agent. Please try again.",
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
      <div className="mb-4 pb-2 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">
          {isGoalMode ? "ゴールからエージェントを生成" : "新規エージェント作成"}
        </h2>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setIsGoalMode(!isGoalMode)}
          className="flex items-center text-primary"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGoalMode ? "手動モードに戻る" : "ゴールから生成"}
        </Button>
      </div>
    
      {isGoalMode ? (
        <DynamicAgentGenerator onAgentGenerated={handleAgentGenerated} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit">
                {isDynamicGeneration ? "動的生成" : "作成"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateAgentForm;
