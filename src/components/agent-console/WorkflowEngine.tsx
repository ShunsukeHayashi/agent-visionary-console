
import React, { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import { 
  BarChart, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

// Mock workflow data
const mockWorkflows = [
  {
    id: "W001",
    name: "Customer Data Analysis",
    status: "in-progress",
    progress: 65,
    createdAt: "2023-06-10",
    steps: [
      { id: 1, name: "Data Collection", status: "completed", agent: "AI_001" },
      { id: 2, name: "Data Cleaning", status: "completed", agent: "AI_001" },
      { id: 3, name: "Data Analysis", status: "in-progress", agent: "AI_001" },
      { id: 4, name: "Report Generation", status: "pending", agent: "AI_003" },
      { id: 5, name: "Insights Delivery", status: "pending", agent: "AI_002" }
    ]
  },
  {
    id: "W002",
    name: "Product Recommendation Optimization",
    status: "pending",
    progress: 0,
    createdAt: "2023-06-15",
    steps: [
      { id: 1, name: "User Behavior Analysis", status: "pending", agent: "AI_004" },
      { id: 2, name: "Preference Modeling", status: "pending", agent: "AI_004" },
      { id: 3, name: "Algorithm Training", status: "pending", agent: "AI_001" },
      { id: 4, name: "A/B Testing Setup", status: "pending", agent: "AI_005" }
    ]
  },
  {
    id: "W003",
    name: "Market Research Report",
    status: "completed",
    progress: 100,
    createdAt: "2023-05-20",
    steps: [
      { id: 1, name: "Competitor Analysis", status: "completed", agent: "AI_005" },
      { id: 2, name: "Market Trend Analysis", status: "completed", agent: "AI_004" },
      { id: 3, name: "SWOT Analysis", status: "completed", agent: "AI_004" },
      { id: 4, name: "Report Compilation", status: "completed", agent: "AI_003" }
    ]
  },
  {
    id: "W004",
    name: "Customer Support Automation",
    status: "in-progress",
    progress: 30,
    createdAt: "2023-06-05",
    steps: [
      { id: 1, name: "Intent Classification Model", status: "completed", agent: "AI_002" },
      { id: 2, name: "Response Templates", status: "in-progress", agent: "AI_002" },
      { id: 3, name: "Integration with CRM", status: "pending", agent: "AI_001" },
      { id: 4, name: "Testing and Tuning", status: "pending", agent: "AI_002" }
    ]
  }
];

const WorkflowEngine = () => {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [openWorkflow, setOpenWorkflow] = useState(null);
  
  const { toast } = useToast();

  const toggleWorkflow = (id) => {
    setOpenWorkflow(openWorkflow === id ? null : id);
  };

  const createNewWorkflow = () => {
    toast({
      title: "Create New Workflow",
      description: "This feature will allow creating new workflows for AI agents.",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Workflow Engine</h2>
          <Button variant="primary" onClick={createNewWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Collapsible
              key={workflow.id}
              open={openWorkflow === workflow.id}
              onOpenChange={() => toggleWorkflow(workflow.id)}
              className="border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: {workflow.id} · Created: {workflow.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm mr-4">
                      {getStatusIcon(workflow.status)}
                      <span className="ml-2 capitalize">{workflow.status.replace("-", " ")}</span>
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          workflow.status === "completed" ? "bg-green-500" :
                          workflow.status === "in-progress" ? "bg-blue-500" :
                          "bg-amber-500"
                        }`} 
                        style={{ width: `${workflow.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{workflow.progress}%</span>
                    {openWorkflow === workflow.id ? 
                      <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t px-4 py-3 bg-muted/10">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-3">Workflow Steps</h4>
                  <div className="relative">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex mb-8 last:mb-0 relative">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                            step.status === "completed" ? "border-green-500 bg-green-50" :
                            step.status === "in-progress" ? "border-blue-500 bg-blue-50" :
                            "border-gray-300 bg-gray-50"
                          }`}>
                            {step.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : step.status === "in-progress" ? (
                              <Clock className="h-4 w-4 text-blue-500" />
                            ) : (
                              <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                            )}
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <div className={`w-0.5 h-6 ${
                              step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                            }`}></div>
                          )}
                        </div>
                        <div className="bg-card rounded-md p-3 shadow-sm flex-grow">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-sm">{step.name}</h5>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded mr-2">
                                {step.agent}
                              </span>
                              <div className="flex items-center text-xs">
                                {getStatusIcon(step.status)}
                                <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                              </div>
                            </div>
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <div className="flex items-center justify-center my-1 text-muted-foreground">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default WorkflowEngine;
