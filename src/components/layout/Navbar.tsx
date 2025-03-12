
import React from "react";
import { Button } from "../ui/Button";
import { Search, Bell, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "ログアウト完了",
      description: "正常にログアウトしました。",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-border/40 px-4">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-medium text-xl">Agent Console</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-full bg-secondary px-9 py-2 text-sm outline-none transition-all focus:w-80"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            {user && (
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="ログアウト">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
