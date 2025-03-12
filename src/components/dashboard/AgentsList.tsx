
import React from "react";
import { MoreHorizontal, Check, AlertCircle, Clock } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { Button } from "../ui/Button";

// Mock data for agents
const agents = [
  {
    id: 1,
    name: "Customer Support Agent",
    status: "active",
    model: "GPT-4",
    lastActivity: "2 minutes ago",
    requests: 1243,
  },
  {
    id: 2,
    name: "Data Analysis Assistant",
    status: "active",
    model: "Claude 3",
    lastActivity: "10 minutes ago",
    requests: 892,
  },
  {
    id: 3,
    name: "Content Generator",
    status: "inactive",
    model: "GPT-4",
    lastActivity: "3 hours ago",
    requests: 512,
  },
  {
    id: 4,
    name: "Code Review Bot",
    status: "maintenance",
    model: "Gemini Pro",
    lastActivity: "1 day ago",
    requests: 156,
  },
];

const AgentsList: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      case "maintenance":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardCard className="h-full animate-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">AI Agents</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Requests</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {agents.map((agent) => (
              <tr 
                key={agent.id} 
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium">{agent.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    {getStatusIcon(agent.status)}
                    <span className="ml-2 capitalize">{agent.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{agent.model}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{agent.lastActivity}</td>
                <td className="px-6 py-4 text-sm">{agent.requests.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default AgentsList;
