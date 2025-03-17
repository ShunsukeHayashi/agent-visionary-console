
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Command, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = false }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isMobile = window.innerWidth < 768;

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-10 flex h-full w-64 flex-col border-r bg-background transition-transform md:relative md:translate-x-0", 
      isMobile && !isOpen ? "-translate-x-full" : "translate-x-0")}>
      <div className="flex h-14 items-center border-b px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Agent Platform</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            to="/console"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              (pathname.startsWith("/console") || pathname.startsWith("/agent-console")) ? "bg-secondary text-primary" : "text-muted-foreground"
            )}
          >
            <Command className="h-4 w-4" />
            <span>Agent Console</span>
          </Link>
          
          <Link
            to="/personal-agent"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/personal-agent") ? "bg-secondary text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-4 w-4" />
            <span>パーソナルエージェント</span>
          </Link>
          
          <Link
            to="/tools"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/tools") ? "bg-secondary text-primary" : "text-muted-foreground"
            )}
          >
            <Wrench className="h-4 w-4" />
            <span>ツール</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
