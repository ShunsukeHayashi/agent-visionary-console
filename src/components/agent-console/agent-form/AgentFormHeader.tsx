
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AgentFormHeaderProps {
  isGoalMode: boolean;
  toggleGoalMode: () => void;
}

const AgentFormHeader: React.FC<AgentFormHeaderProps> = ({
  isGoalMode,
  toggleGoalMode
}) => {
  return (
    <div className="mb-4 pb-2 border-b flex justify-between items-center">
      <h2 className="text-xl font-bold tracking-tight">
        {isGoalMode ? "ゴールからエージェントを生成" : "新規エージェント作成"}
      </h2>
      <Button 
        type="button" 
        variant="ghost" 
        onClick={toggleGoalMode}
        className="flex items-center text-primary"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGoalMode ? "手動モードに戻る" : "ゴールから生成"}
      </Button>
    </div>
  );
};

export default AgentFormHeader;
