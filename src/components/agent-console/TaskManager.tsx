
import React, { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter, ArrowDown, ArrowUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock tasks data
const mockTasks = [
  { 
    id: "T001", 
    name: "Data Analysis for Q2", 
    status: "in-progress", 
    priority: "high", 
    assignedTo: "AI_001", 
    deadline: "2023-06-30", 
    progress: 65 
  },
  { 
    id: "T002", 
    name: "Customer Feedback Processing", 
    status: "pending", 
    priority: "medium", 
    assignedTo: "AI_002", 
    deadline: "2023-07-15", 
    progress: 0 
  },
  { 
    id: "T003", 
    name: "Weekly Report Generation", 
    status: "completed", 
    priority: "high", 
    assignedTo: "AI_003", 
    deadline: "2023-06-15", 
    progress: 100 
  },
  { 
    id: "T004", 
    name: "Market Analysis", 
    status: "in-progress", 
    priority: "medium", 
    assignedTo: "AI_001", 
    deadline: "2023-07-10", 
    progress: 35 
  },
  { 
    id: "T005", 
    name: "Product Recommendation System", 
    status: "pending", 
    priority: "low", 
    assignedTo: "AI_004", 
    deadline: "2023-08-01", 
    progress: 0 
  },
  { 
    id: "T006", 
    name: "Customer Support Automation", 
    status: "completed", 
    priority: "high", 
    assignedTo: "AI_002", 
    deadline: "2023-06-20", 
    progress: 100 
  }
];

// Available AI agents
const agents = [
  { id: "AI_001", name: "Data Processor" },
  { id: "AI_002", name: "Support Agent" },
  { id: "AI_003", name: "Report Generator" },
  { id: "AI_004", name: "Product Analyst" },
  { id: "AI_005", name: "Marketing Assistant" },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const { toast } = useToast();

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           task.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };

    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${classes[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const createNewTask = () => {
    toast({
      title: "Create New Task",
      description: "This feature will allow creating new tasks for AI agents.",
    });
  };

  const viewTaskDetails = (task) => {
    toast({
      title: `Task ${task.id}`,
      description: `${task.name} - Assigned to ${task.assignedTo}`,
    });
  };

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <h2 className="text-lg font-semibold">Task Management</h2>
          <Button variant="primary" onClick={createNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="w-full md:w-auto relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                  {statusFilter === "all" ? "All Statuses" : 
                   statusFilter === "completed" ? "Completed" :
                   statusFilter === "in-progress" ? "In Progress" : "Pending"}
                  <Filter className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" 
                    onClick={() => toggleSort("id")}>
                  <div className="flex items-center">
                    Task ID
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
                    Task Name
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
                    Status
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
                    Priority
                    {sortBy === "priority" && (
                      sortOrder === "asc" ? 
                      <ArrowUp className="h-4 w-4 ml-1" /> : 
                      <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("deadline")}>
                  <div className="flex items-center">
                    Deadline
                    {sortBy === "deadline" && (
                      sortOrder === "asc" ? 
                      <ArrowUp className="h-4 w-4 ml-1" /> : 
                      <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => viewTaskDetails(task)}
                >
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{task.id}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">{task.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      {getStatusIcon(task.status)}
                      <span className="ml-2 capitalize">{task.status.replace("-", " ")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getPriorityBadge(task.priority)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">{task.assignedTo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{task.deadline}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default TaskManager;
