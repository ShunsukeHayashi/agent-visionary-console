
import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Filter } from "lucide-react";

interface TaskFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 min-w-[120px] justify-between">
            {statusFilter === "all" ? "すべてのステータス" : 
             statusFilter === "completed" ? "完了" :
             statusFilter === "in-progress" ? "進行中" : "保留中"}
            <Filter className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setStatusFilter("all")}>すべてのステータス</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter("completed")}>完了</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>進行中</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter("pending")}>保留中</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskFilter;
