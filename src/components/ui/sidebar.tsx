
import React from "react";
import { Home, Bot, Tools } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const SidebarItem: React.FC<{
  icon: React.ElementType;
  label: string;
  active?: boolean;
}> = ({ icon: Icon, label, active }) => {
  return (
    <li>
      <a
        href="#"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
          active 
            ? "bg-primary text-white" 
            : "text-sidebar-foreground hover:bg-secondary"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar pt-16 shadow-sm transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto border-r border-sidebar-border px-3 py-4">
        <div className="mb-6 flex justify-between items-center px-2">
          <h3 className="text-xs font-medium uppercase text-muted-foreground">Dashboard</h3>
        </div>
        
        <nav>
          <ul className="space-y-1">
            <SidebarItem icon={Home} label="Overview" active />
            <SidebarItem icon={Bot} label="Agents" />
            <SidebarItem icon={Tools} label="Tools" />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
