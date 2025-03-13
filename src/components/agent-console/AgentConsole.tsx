
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "@/components/agent-console/TaskManager";
import WorkflowEngine from "@/components/agent-console/WorkflowEngine";
import AgentStatusBoard from "@/components/agent-console/AgentStatusBoard";
import ConsoleOverview from "@/components/agent-console/ConsoleOverview";
import ProjectManagement from "@/components/agent-console/ProjectManagement";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateAgentForm from "@/components/agent-console/CreateAgentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const AgentConsole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateAgentDialogOpen, setIsCreateAgentDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateAgentSubmit = (values: any) => {
    console.log("Agent creation values:", values);
    setIsCreateAgentDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      <main className="flex-1 pt-16 md:pl-64 transition-all duration-300 overflow-auto">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="container py-8 px-4 md:px-8 max-w-[1600px] pb-20">
            <header className="mb-8 fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Management</p>
                  <h1 className="text-2xl md:text-3xl font-bold">AI Agent Console</h1>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => setIsCreateAgentDialogOpen(true)}
                  className="md:self-end"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規エージェント作成
                </Button>
              </div>
            </header>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Task Manager</TabsTrigger>
                <TabsTrigger value="workflows">Workflow Engine</TabsTrigger>
                <TabsTrigger value="agents">Agent Status</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <ConsoleOverview />
              </TabsContent>
              <TabsContent value="tasks" className="space-y-6">
                <TaskManager />
              </TabsContent>
              <TabsContent value="workflows" className="space-y-6">
                <WorkflowEngine />
              </TabsContent>
              <TabsContent value="agents" className="space-y-6">
                <AgentStatusBoard />
              </TabsContent>
              <TabsContent value="projects" className="space-y-6">
                <ProjectManagement />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </main>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateAgentDialogOpen} onOpenChange={setIsCreateAgentDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <CreateAgentForm
            onSubmit={handleCreateAgentSubmit}
            onCancel={() => setIsCreateAgentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentConsole;
