
import React from "react";
import { MoreHorizontal, Check, AlertCircle, Clock } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for agents
const agents = [
  {
    id: 1,
    name: "Customer Support Agent",
    status: "active",
    model: "GPT-4",
    lastActivity: "2 minutes ago",
    requests: 1243,
    avatarUrl: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-ufZJsutRYJZPOLWch8zQmLdI/user-mz5yXLkbPoPgGssjlz9a3T7p/img-KXKo3wj23RzL3yhvRJw9m0Pc.png?st=2024-07-13T15%3A09%3A15Z&se=2024-07-13T17%3A09%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-07-13T07%3A07%3A31Z&ske=2024-07-14T07%3A07%3A31Z&sks=b&skv=2021-08-06&sig=MYHoHYL1UEOYl8xXLSL4kPeKvqoW5SvOWdJnOuUe6G0%3D"
  },
  {
    id: 2,
    name: "Data Analysis Assistant",
    status: "active",
    model: "Claude 3",
    lastActivity: "10 minutes ago",
    requests: 892,
    avatarUrl: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-ufZJsutRYJZPOLWch8zQmLdI/user-mz5yXLkbPoPgGssjlz9a3T7p/img-Fsh9Hhh8xVvUi0wtrCCxj2sR.png?st=2024-07-13T15%3A09%3A55Z&se=2024-07-13T17%3A09%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-07-13T07%3A07%3A11Z&ske=2024-07-14T07%3A07%3A11Z&sks=b&skv=2021-08-06&sig=5Mb2wSFvOYxnK49cJM6a2iqWpJA%2Bd5Qjzh8zgIUOqVk%3D"
  },
  {
    id: 3,
    name: "Content Generator",
    status: "inactive",
    model: "GPT-4",
    lastActivity: "3 hours ago",
    requests: 512,
    avatarUrl: null
  },
  {
    id: 4,
    name: "Code Review Bot",
    status: "maintenance",
    model: "Gemini Pro",
    lastActivity: "1 day ago",
    requests: 156,
    avatarUrl: null
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

  // Get initials for the fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      {agent.avatarUrl ? (
                        <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(agent.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                </td>
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
