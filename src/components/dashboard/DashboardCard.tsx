
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-elevation animate-in",
      className
    )}>
      {children}
    </div>
  );
};

export default DashboardCard;
