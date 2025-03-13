
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, UserCheck, HandMetal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HumanTaskIndicatorProps {
  type?: "review" | "approval" | "manual" | "intervention";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const HumanTaskIndicator: React.FC<HumanTaskIndicatorProps> = ({
  type = "intervention",
  size = "md",
  showLabel = true
}) => {
  const getIcon = () => {
    switch (type) {
      case "review":
        return <Eye className={size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"} />;
      case "approval":
        return <UserCheck className={size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"} />;
      case "manual":
      case "intervention":
      default:
        return <HandMetal className={size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case "review": return "要確認";
      case "approval": return "承認必要";
      case "manual": return "手動処理";
      case "intervention": default: return "人間介入";
    }
  };

  const getTooltipText = () => {
    switch (type) {
      case "review": 
        return "このステップでは人間による確認が必要です";
      case "approval": 
        return "このステップでは人間による承認が必要です";
      case "manual": 
        return "このステップは人間による手動処理が必要です";
      case "intervention": 
      default: 
        return "このステップでは人間の介入が必要です";
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case "review": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "approval": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "manual": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "intervention": default: return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 font-normal ${getBadgeColor()}`}
          >
            {getIcon()}
            {showLabel && <span>{getLabel()}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HumanTaskIndicator;
