
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
  ChevronUp,
  User,
  Bot
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import HumanTaskIndicator from "./task/components/HumanTaskIndicator";
import { useIsMobile } from "@/hooks/use-mobile";

// Step type definition to fix type errors
type WorkflowStep = {
  id: number;
  name: string;
  status: "completed" | "in-progress" | "pending";
  agent: string;
  isHumanTask?: boolean;
  humanTaskType?: "review" | "approval" | "manual" | "intervention";
};

// Workflow type definition
type Workflow = {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  createdAt: string;
  steps: WorkflowStep[];
};

// Mock workflow data
const mockWorkflows: Workflow[] = [
  {
    id: "W001",
    name: "Customer Data Analysis",
    status: "in-progress",
    progress: 65,
    createdAt: "2023-06-10",
    steps: [
      { id: 1, name: "Data Collection", status: "completed", agent: "AI_001", isHumanTask: false },
      { id: 2, name: "Data Cleaning", status: "completed", agent: "AI_001", isHumanTask: false },
      { id: 3, name: "Data Analysis", status: "in-progress", agent: "AI_001", isHumanTask: false },
      { id: 4, name: "人間によるデータレビュー", status: "pending", agent: "HUMAN_001", isHumanTask: true, humanTaskType: "review" },
      { id: 5, name: "Report Generation", status: "pending", agent: "AI_003", isHumanTask: false },
      { id: 6, name: "Insights Delivery", status: "pending", agent: "AI_002", isHumanTask: false }
    ]
  },
  {
    id: "W002",
    name: "Product Recommendation Optimization",
    status: "pending",
    progress: 0,
    createdAt: "2023-06-15",
    steps: [
      { id: 1, name: "User Behavior Analysis", status: "pending", agent: "AI_004", isHumanTask: false },
      { id: 2, name: "Preference Modeling", status: "pending", agent: "AI_004", isHumanTask: false },
      { id: 3, name: "Algorithm Training", status: "pending", agent: "AI_001", isHumanTask: false },
      { id: 4, name: "人間による評価・調整", status: "pending", agent: "HUMAN_002", isHumanTask: true, humanTaskType: "manual" },
      { id: 5, name: "A/B Testing Setup", status: "pending", agent: "AI_005", isHumanTask: false }
    ]
  },
  {
    id: "W003",
    name: "Market Research Report",
    status: "completed",
    progress: 100,
    createdAt: "2023-05-20",
    steps: [
      { id: 1, name: "Competitor Analysis", status: "completed", agent: "AI_005", isHumanTask: false },
      { id: 2, name: "Market Trend Analysis", status: "completed", agent: "AI_004", isHumanTask: false },
      { id: 3, name: "SWOT Analysis", status: "completed", agent: "AI_004", isHumanTask: false },
      { id: 4, name: "人間による検証・承認", status: "completed", agent: "HUMAN_003", isHumanTask: true, humanTaskType: "approval" },
      { id: 5, name: "Report Compilation", status: "completed", agent: "AI_003", isHumanTask: false }
    ]
  },
  {
    id: "W004",
    name: "Customer Support Automation",
    status: "in-progress",
    progress: 30,
    createdAt: "2023-06-05",
    steps: [
      { id: 1, name: "Intent Classification Model", status: "completed", agent: "AI_002", isHumanTask: false },
      { id: 2, name: "Response Templates", status: "in-progress", agent: "AI_002", isHumanTask: false },
      { id: 3, name: "人間によるテンプレート確認", status: "pending", agent: "HUMAN_004", isHumanTask: true, humanTaskType: "review" },
      { id: 4, name: "Integration with CRM", status: "pending", agent: "AI_001", isHumanTask: false },
      { id: 5, name: "Testing and Tuning", status: "pending", agent: "AI_002", isHumanTask: false },
      { id: 6, name: "最終承認", status: "pending", agent: "HUMAN_001", isHumanTask: true, humanTaskType: "approval" }
    ]
  },
  {
    id: "W005",
    name: "勤怠・給与計算自動化",
    status: "in-progress",
    progress: 40,
    createdAt: "2023-06-01",
    steps: [
      { id: 1, name: "勤怠データ受け取り", status: "completed", agent: "HUMAN_002", isHumanTask: true, humanTaskType: "manual" },
      { id: 2, name: "OCR処理", status: "completed", agent: "AI_003", isHumanTask: false },
      { id: 3, name: "スプレッドシート集約", status: "completed", agent: "AI_003", isHumanTask: false },
      { id: 4, name: "自動計算処理", status: "in-progress", agent: "AI_001", isHumanTask: false },
      { id: 5, name: "給与明細作成", status: "pending", agent: "AI_004", isHumanTask: false },
      { id: 6, name: "目視ダブルチェック", status: "pending", agent: "HUMAN_003", isHumanTask: true, humanTaskType: "review" },
      { id: 7, name: "振込処理", status: "pending", agent: "HUMAN_001", isHumanTask: true, humanTaskType: "manual" }
    ]
  }
];

const WorkflowEngine = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [openWorkflow, setOpenWorkflow] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const { toast } = useToast();

  const toggleWorkflow = (id: string) => {
    setOpenWorkflow(openWorkflow === id ? null : id);
  };

  const createNewWorkflow = () => {
    toast({
      title: "Create New Workflow",
      description: "This feature will allow creating new workflows for AI agents.",
    });
  };

  const getStatusIcon = (status: "completed" | "in-progress" | "pending") => {
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

  const getAgentIcon = (agentId: string) => {
    if (agentId && agentId.startsWith("HUMAN")) {
      return <User className="h-4 w-4 text-purple-500" />;
    }
    return <Bot className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardCard>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold">Workflow Engine</h2>
          <Button variant="primary" onClick={createNewWorkflow} size={isMobile ? "sm" : "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {isMobile ? "新規" : "New Workflow"}
          </Button>
        </div>

        <div className="space-y-3 md:space-y-4">
          {workflows.map((workflow) => (
            <Collapsible
              key={workflow.id}
              open={openWorkflow === workflow.id}
              onOpenChange={() => toggleWorkflow(workflow.id)}
              className="border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center min-w-0">
                    <BarChart className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{workflow.name}</h3>
                      {!isMobile && (
                        <p className="text-xs text-muted-foreground">ID: {workflow.id} · Created: {workflow.createdAt}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                    <div className="flex items-center text-xs md:text-sm md:mr-4">
                      {getStatusIcon(workflow.status)}
                      <span className="ml-1 md:ml-2 capitalize hidden md:inline-block">{workflow.status.replace("-", " ")}</span>
                    </div>
                    <div className="w-16 md:w-32 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          workflow.status === "completed" ? "bg-green-500" :
                          workflow.status === "in-progress" ? "bg-blue-500" :
                          "bg-amber-500"
                        }`} 
                        style={{ width: `${workflow.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">{workflow.progress}%</span>
                    {openWorkflow === workflow.id ? 
                      <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" /> : 
                      <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    }
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t px-3 py-2 md:px-4 md:py-3 bg-muted/10">
                <div className="space-y-2">
                  <h4 className="font-medium text-xs md:text-sm mb-2 md:mb-3">Workflow Steps</h4>
                  <div className="relative">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex mb-6 md:mb-8 last:mb-0 relative">
                        <div className="flex flex-col items-center mr-2 md:mr-4">
                          <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 ${
                            step.status === "completed" ? "border-green-500 bg-green-50" :
                            step.status === "in-progress" ? "border-blue-500 bg-blue-50" :
                            "border-gray-300 bg-gray-50"
                          }`}>
                            {step.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                            ) : step.status === "in-progress" ? (
                              <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                            ) : (
                              <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                            )}
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <div className={`w-0.5 h-5 md:h-6 ${
                              step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                            }`}></div>
                          )}
                        </div>
                        <div className={`bg-card rounded-md p-2 md:p-3 shadow-sm flex-grow ${
                          step.isHumanTask ? "border-l-4 border-purple-400" : ""
                        }`}>
                          <div className="flex justify-between items-center flex-wrap">
                            <div className="flex items-center flex-wrap mr-1">
                              <h5 className="font-medium text-xs md:text-sm">{step.name}</h5>
                              {step.isHumanTask && step.humanTaskType && (
                                <div className="ml-1 md:ml-2 mt-1 md:mt-0">
                                  <HumanTaskIndicator 
                                    type={step.humanTaskType} 
                                    size={isMobile ? "sm" : "md"} 
                                    showLabel={!isMobile}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap mt-1 md:mt-0">
                              <span className="text-xs bg-muted px-1 py-0.5 md:px-2 md:py-0.5 rounded mr-1 md:mr-2 flex items-center">
                                {getAgentIcon(step.agent)}
                                <span className="ml-1 text-[10px] md:text-xs">{step.agent}</span>
                              </span>
                              <div className="flex items-center text-[10px] md:text-xs">
                                {getStatusIcon(step.status)}
                                <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                              </div>
                            </div>
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <div className="flex items-center justify-center my-1 text-muted-foreground">
                              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
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
