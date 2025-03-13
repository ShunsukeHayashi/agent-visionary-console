
import React from "react";
import { Button } from "@/components/ui/Button";
import { 
  CommandIcon, 
  ArrowRight, 
  PlayCircle, 
  ListOrdered, 
  Zap
} from "lucide-react";

export type CommandType = {
  id: string;
  label: string;
  description: string;
  icon?: string;
  action: () => void;
  order: number;
};

interface CommandButtonProps {
  command: CommandType;
  isActive: boolean;
  isNext: boolean;
  onExecute: () => void;
}

const CommandButton: React.FC<CommandButtonProps> = ({
  command,
  isActive,
  isNext,
  onExecute
}) => {
  const getIcon = () => {
    switch (command.icon) {
      case "play": return <PlayCircle className="h-4 w-4 mr-2" />;
      case "list": return <ListOrdered className="h-4 w-4 mr-2" />;
      case "arrow": return <ArrowRight className="h-4 w-4 mr-2" />;
      case "zap": return <Zap className="h-4 w-4 mr-2" />;
      default: return <CommandIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Button
      variant={isActive ? "default" : isNext ? "outline" : "ghost"}
      size="sm"
      className={`
        w-full justify-start mb-2 text-left
        ${isActive ? "bg-primary text-primary-foreground" : ""}
        ${isNext ? "border-primary border-dashed text-primary" : ""}
        ${!isActive && !isNext ? "opacity-70" : ""}
      `}
      onClick={onExecute}
      disabled={!isActive && !isNext}
    >
      <div className="flex items-center">
        {getIcon()}
        <div>
          <div className="font-medium">{command.label}</div>
          <div className="text-xs opacity-90">{command.description}</div>
        </div>
        {isNext && <ArrowRight className="ml-auto h-4 w-4 text-primary" />}
      </div>
    </Button>
  );
};

export default CommandButton;
