
import React from "react";
import { Button } from "@/components/ui/Button";
import { 
  CommandIcon, 
  ArrowRight, 
  PlayCircle, 
  ListOrdered, 
  Zap,
  Wrench,
  FileText,
  Code,
  Database,
  Cog
} from "lucide-react";

export type CommandType = {
  id: string;
  label: string;
  description: string;
  icon?: string;
  action: () => void;
  order: number;
  isToolCommand?: boolean;
  toolType?: 'api' | 'function' | 'database' | 'document' | string;
  toolDetails?: {
    input?: string;
    output?: string;
    parameters?: Array<{name: string, type: string, description: string}>;
    example?: string;
  };
};

interface CommandButtonProps {
  command: CommandType;
  isActive: boolean;
  isNext: boolean;
  onExecute: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CommandButton: React.FC<CommandButtonProps> = ({
  command,
  isActive,
  isNext,
  onExecute,
  className = "",
  style
}) => {
  const getIcon = () => {
    // Tool関連のアイコン
    if (command.isToolCommand) {
      switch (command.toolType) {
        case "api": return <Code className="h-4 w-4 mr-2" />;
        case "function": return <Cog className="h-4 w-4 mr-2" />;
        case "database": return <Database className="h-4 w-4 mr-2" />;
        case "document": return <FileText className="h-4 w-4 mr-2" />;
        default: return <Wrench className="h-4 w-4 mr-2" />;
      }
    }
    
    // 既存のアイコン
    switch (command.icon) {
      case "play": return <PlayCircle className="h-4 w-4 mr-2" />;
      case "list": return <ListOrdered className="h-4 w-4 mr-2" />;
      case "arrow": return <ArrowRight className="h-4 w-4 mr-2" />;
      case "zap": return <Zap className="h-4 w-4 mr-2" />;
      case "tool": return <Wrench className="h-4 w-4 mr-2" />; 
      default: return <CommandIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Button
      variant={isActive ? "default" : isNext ? "outline" : "ghost"}
      size="sm"
      className={`
        w-full justify-start mb-2 text-left transition-all
        ${isActive ? "bg-primary text-primary-foreground shadow-sm" : ""}
        ${isNext ? "border-primary border-dashed text-primary hover:bg-primary/10" : ""}
        ${!isActive && !isNext ? "opacity-70 hover:opacity-100" : ""}
        ${command.isToolCommand ? "border-l-4 border-l-blue-500" : ""}
        ${className}
      `}
      onClick={onExecute}
      disabled={!isActive && !isNext}
      style={style}
    >
      <div className="flex items-center w-full">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{command.label}</div>
          <div className="text-xs opacity-90 truncate">{command.description}</div>
        </div>
        {isNext && <ArrowRight className="ml-auto h-4 w-4 text-primary flex-shrink-0" />}
      </div>
    </Button>
  );
};

export default CommandButton;
