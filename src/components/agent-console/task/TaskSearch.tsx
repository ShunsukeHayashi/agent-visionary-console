
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TaskSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full md:w-auto relative flex-grow">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="タスクを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default TaskSearch;
