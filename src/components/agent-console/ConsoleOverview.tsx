
import React from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ArrowUp, Bell, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConsoleOverview = () => {
  const { toast } = useToast();
  
  // Mock data for the overview
  const stats = {
    totalAgents: 10,
    activeAgents: 7,
    totalTasks: 48,
    completedTasks: 32,
    inProgressTasks: 12,
    pendingTasks: 4,
    workflowCompletion: 67,
    agentEfficiency: 85,
  };

  const notifications = [
    { id: 1, message: "Agent AI_001: Task 'Data Analysis' started", time: "2 minutes ago", type: "info" },
    { id: 2, message: "Agent AI_002: New task 'Report Generation' assigned", time: "15 minutes ago", type: "assignment" },
    { id: 3, message: "Workflow 'Project A' reached 70% completion", time: "1 hour ago", type: "progress" },
    { id: 4, message: "Agent AI_003: Task 'Image Processing' completed", time: "3 hours ago", type: "completion" },
  ];

  const showNotificationDetails = (notification) => {
    toast({
      title: "Notification Details",
      description: `${notification.message} - ${notification.time}`,
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "assignment":
        return <ArrowUp className="h-4 w-4 text-amber-500" />;
      case "progress":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case "completion":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall metrics */}
      <div className="lg:col-span-2 slide-up" style={{ animationDelay: '100ms' }}>
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4">Console Performance</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={stats.workflowCompletion}
                  text={`${stats.workflowCompletion}%`}
                  styles={buildStyles({
                    pathColor: `hsl(var(--primary))`,
                    textColor: 'hsl(var(--primary))',
                    trailColor: 'hsl(var(--muted))',
                  })}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Workflow Completion</p>
                <p className="text-lg font-semibold">{stats.workflowCompletion}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={stats.agentEfficiency}
                  text={`${stats.agentEfficiency}%`}
                  styles={buildStyles({
                    pathColor: `hsl(var(--primary))`,
                    textColor: 'hsl(var(--primary))',
                    trailColor: 'hsl(var(--muted))',
                  })}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Agent Efficiency</p>
                <p className="text-lg font-semibold">{stats.agentEfficiency}%</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalAgents}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.activeAgents}</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalTasks}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.completedTasks}</p>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Tasks Status */}
      <div className="slide-up" style={{ animationDelay: '200ms' }}>
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4">Tasks Status</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">{stats.completedTasks}/{stats.totalTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-sm font-medium">{stats.inProgressTasks}/{stats.totalTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-sm font-medium">{stats.pendingTasks}/{stats.totalTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(stats.pendingTasks / stats.totalTasks) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Notifications */}
      <div className="slide-up" style={{ animationDelay: '300ms' }}>
        <DashboardCard className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {notifications.length} new
            </span>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                onClick={() => showNotificationDetails(notification)}
              >
                <div className="mr-3 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default ConsoleOverview;
