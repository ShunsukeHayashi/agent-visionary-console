
import { useState, useMemo } from "react";
import { Task } from "@/types/task";

export const useTaskFiltering = (tasks: Task[] | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             task.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // ソート用の比較関数
        const aValue = a[sortBy as keyof Task];
        const bValue = b[sortBy as keyof Task];
        
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortOrder === "asc" ? -1 : 1;
        if (!bValue) return sortOrder === "asc" ? 1 : -1;
        
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [tasks, searchTerm, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    filteredTasks,
    toggleSort
  };
};
