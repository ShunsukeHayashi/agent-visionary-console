
import React, { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle,
  Clock, 
  AlertCircle, 
  UserCheck,
  BookOpen, 
  Database,
  FileText, 
  Code, 
  MessageSquare,
  BarChart,
  Image,
  Star,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Mock agents data
const mockAgents = [
  {
    id: "AI_001",
    name: "Data Processor",
    status: "active",
    type: "data",
    skills: [
      { name: "Data Analysis", level: 92 },
      { name: "ETL Processes", level: 85 },
      { name: "Database Management", level: 78 }
    ],
    tools: ["pandas", "scikit-learn", "postgresql"],
    currentTask: "T001",
    uptime: "5d 12h",
    performance: 96,
    version: "3.2.1"
  },
  {
    id: "AI_002",
    name: "Support Agent",
    status: "active",
    type: "customer-support",
    skills: [
      { name: "Natural Language Processing", level: 90 },
      { name: "Sentiment Analysis", level: 82 },
      { name: "Issue Classification", level: 88 }
    ],
    tools: ["nltk", "spacy", "zendesk-api"],
    currentTask: "T006",
    uptime: "3d 4h",
    performance: 87,
    version: "2.4.0"
  },
  {
    id: "AI_003",
    name: "Report Generator",
    status: "idle",
    type: "document",
    skills: [
      { name: "Document Generation", level: 94 },
      { name: "Data Visualization", level: 87 },
      { name: "Text Summarization", level: 85 }
    ],
    tools: ["matplotlib", "docx", "seaborn"],
    currentTask: null,
    uptime: "7d 8h",
    performance: 92,
    version: "1.9.5"
  },
  {
    id: "AI_004",
    name: "Product Analyst",
    status: "maintenance",
    type: "analytics",
    skills: [
      { name: "Market Analysis", level: 89 },
      { name: "Trend Forecasting", level: 83 },
      { name: "Comparative Analysis", level: 90 }
    ],
    tools: ["tensorflow", "tableau-api", "snowflake"],
    currentTask: null,
    uptime: "0d 6h",
    performance: 75,
    version: "2.1.3"
  },
  {
    id: "AI_005",
    name: "Marketing Assistant",
    status: "active",
    type: "marketing",
    skills: [
      { name: "Content Generation", level: 88 },
      { name: "A/B Testing", level: 80 },
      { name: "Campaign Analysis", level: 85 }
    ],
    tools: ["google-analytics", "mailchimp-api", "figma-api"],
    currentTask: null,
    uptime: "2d 14h",
    performance: 89,
    version: "1.7.2"
  }
];

const AgentStatusBoard = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const { toast } = useToast();

  const createNewAgent = () => {
    toast({
      title: "Create New AI Agent",
      description: "This feature will allow creating new AI agents.",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "idle":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getAgentTypeIcon = (type) => {
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
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const viewAgentDetails = (agent) => {
    setSelectedAgent(agent);
  };

  const manageAgent = (action, agent) => {
    toast({
      title: `${action} Agent ${agent.id}`,
      description: `${action} operation requested for ${agent.name}`,
    });
  };

  const getPerformanceColor = (value) => {
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-blue-500";
    return "text-amber-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Agent Status Board</h2>
              <Button variant="primary" onClick={createNewAgent}>
                <Plus className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Task</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {agents.map((agent) => (
                    <tr 
                      key={agent.id} 
                      className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => viewAgentDetails(agent)}
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{agent.id}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{agent.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          {getStatusIcon(agent.status)}
                          <span className="ml-2 capitalize">{agent.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          {getAgentTypeIcon(agent.type)}
                          <span className="ml-2 capitalize">{agent.type.replace("-", " ")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {agent.currentTask ? (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {agent.currentTask}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No task</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-24 mr-2">
                            <Progress value={agent.performance} className="h-2" />
                          </div>
                          <span className={getPerformanceColor(agent.performance)}>
                            {agent.performance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => manageAgent("Restart", agent)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => manageAgent("Train", agent)}>
                              <BookOpen className="h-4 w-4 mr-2" />
                              Train
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => manageAgent("Update", agent)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Update
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        <div>
          {selectedAgent ? (
            <DashboardCard className="h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Agent Details</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-muted">v{selectedAgent.version}</span>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    {getAgentTypeIcon(selectedAgent.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{selectedAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAgent.id}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Agent Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedAgent.status)}
                        <span className="ml-2 capitalize">{selectedAgent.status}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Uptime</p>
                      <p className="mt-1">{selectedAgent.uptime}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Current Task</p>
                      <p className="mt-1">{selectedAgent.currentTask || "No task"}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <p className={`mt-1 ${getPerformanceColor(selectedAgent.performance)}`}>{selectedAgent.performance}%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Skills</h4>
                  <div className="space-y-3">
                    {selectedAgent.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{skill.name}</span>
                          <span className="text-sm font-medium">{skill.level}/100</span>
                        </div>
                        <Progress value={skill.level} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.tools.map((tool) => (
                      <span 
                        key={tool} 
                        className="text-xs bg-muted px-2 py-1 rounded flex items-center"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                    Back
                  </Button>
                  <Button variant="primary" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Rate Performance
                  </Button>
                </div>
              </div>
            </DashboardCard>
          ) : (
            <DashboardCard className="h-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select an Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any agent from the table to view detailed information.
                </p>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentStatusBoard;
