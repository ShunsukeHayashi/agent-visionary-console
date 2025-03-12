
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: number;
  changeText?: string;
  positive?: boolean;
  loading?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeText,
  positive = true,
  loading = false,
}) => {
  return (
    <DashboardCard className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {loading ? (
            <div className="h-9 w-24 bg-muted/30 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-semibold mt-1 text-foreground">
              {value}
            </p>
          )}
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium flex items-center",
                positive ? "text-green-500" : "text-red-500"
              )}>
                {positive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {change}%
              </span>
              {changeText && (
                <span className="text-xs text-muted-foreground ml-1">
                  {changeText}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </DashboardCard>
  );
};

export default StatusCard;
