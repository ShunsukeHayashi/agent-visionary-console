
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ className, children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "rounded-xl bg-card shadow-card transition-all hover:shadow-elevation animate-in",
      isMobile ? "p-3" : "p-6",
      className
    )}>
      {children}
    </div>
  );
};

export default DashboardCard;
