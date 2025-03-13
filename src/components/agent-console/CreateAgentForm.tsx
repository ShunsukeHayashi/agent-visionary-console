
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
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
import { Database } from "@/components/ui/database";
import { MessageSquare, BarChart, Image, FileText, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the schema for agent creation
const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Agent name must be at least 2 characters" }),
  type: z.enum(["data", "customer-support", "document", "analytics", "marketing", "development"]),
  description: z.string().optional(),
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      type: "data",
      description: "",
      skills: [
        { name: "Natural Language Processing", level: 75 },
        { name: "Data Analysis", level: 60 }
      ],
      tools: [],
    },
  });

  const handleSubmit = (values: FormValues) => {
    try {
      onSubmit(values);
    } catch (error) {
      toast({
        title: "Error creating agent",
        description: "There was an error creating the agent. Please try again.",
        variant: "destructive",
      });
    }
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
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the agent's capabilities..."
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Agent</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAgentForm;
