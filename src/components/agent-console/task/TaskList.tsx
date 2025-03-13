
import React from "react";
import { ArrowDown, ArrowUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  toggleSort: (field: string) => void;
  sortBy: string;
  sortOrder: string;
  onViewDetails: (task: Task) => void;
  agents: Array<{ id: string; name: string; }>;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  toggleSort, 
  sortBy, 
  sortOrder, 
  onViewDetails,
  agents
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
      case "todo":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const classes = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      urgent: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };

    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${classes[priority as keyof typeof classes] || ""}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getAgentNameById = (agentId?: string) => {
    if (!agentId) return "未割り当て";
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : "未割り当て";
  };

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-left">
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" 
                onClick={() => toggleSort("id")}>
              <div className="flex items-center">
                タスクID
                {sortBy === "id" && (
                  sortOrder === "asc" ? 
                  <ArrowUp className="h-4 w-4 ml-1" /> : 
                  <ArrowDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("name")}>
              <div className="flex items-center">
                タスク名
                {sortBy === "name" && (
                  sortOrder === "asc" ? 
                  <ArrowUp className="h-4 w-4 ml-1" /> : 
                  <ArrowDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("status")}>
              <div className="flex items-center">
                ステータス
                {sortBy === "status" && (
                  sortOrder === "asc" ? 
                  <ArrowUp className="h-4 w-4 ml-1" /> : 
                  <ArrowDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("priority")}>
              <div className="flex items-center">
                優先度
                {sortBy === "priority" && (
                  sortOrder === "asc" ? 
                  <ArrowUp className="h-4 w-4 ml-1" /> : 
                  <ArrowDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">担当エージェント</th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("deadline")}>
              <div className="flex items-center">
                期限
                {sortBy === "deadline" && (
                  sortOrder === "asc" ? 
                  <ArrowUp className="h-4 w-4 ml-1" /> : 
                  <ArrowDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">進捗</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr 
                key={task.id} 
                className="group hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onViewDetails(task)}
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{typeof task.id === 'string' ? task.id.substring(0, 8) : task.id}</td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">{task.name || task.title}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    {getStatusIcon(task.status)}
                    <span className="ml-2 capitalize">
                      {task.status === "completed" ? "完了" : 
                       task.status === "in-progress" ? "進行中" : "保留中"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {getPriorityBadge(task.priority)}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">{getAgentNameById(task.assigned_agent_id)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString('ja-JP') : "未設定"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        task.status === "completed" ? "bg-green-500" :
                        task.status === "in-progress" ? "bg-blue-500" :
                        "bg-amber-500"
                      }`} 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{task.progress}%</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                検索条件に一致するタスクがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
