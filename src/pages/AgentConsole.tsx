
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "@/components/agent-console/TaskManager";
import WorkflowEngine from "@/components/agent-console/WorkflowEngine";
import AgentStatusBoard from "@/components/agent-console/AgentStatusBoard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/Button";
import { Wrench, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateAgentForm from "@/components/agent-console/CreateAgentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const AgentConsole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [isCreateAgentDialogOpen, setIsCreateAgentDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleToolsPanel = () => {
    setShowToolsPanel(!showToolsPanel);
  };

  const handleCreateAgentSubmit = (values: any) => {
    console.log("Agent creation values:", values);
    setIsCreateAgentDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      <main className="flex-1 pt-16 md:pl-64 transition-all duration-300 overflow-hidden flex flex-col">
        <ScrollArea className="h-[calc(100vh-4rem-3.5rem)]">
          <div className="container py-6 px-3 md:py-8 md:px-8 max-w-[1600px] pb-20">
            <header className="mb-6 md:mb-8 fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Management</p>
                  <h1 className="text-2xl md:text-3xl font-bold">AI Agent Console</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="primary" 
                    onClick={() => setIsCreateAgentDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新規エージェント作成
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    onClick={toggleToolsPanel}
                    className="flex items-center gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    {showToolsPanel ? (isMobile ? "Hide" : "Hide Tools") : (isMobile ? "Tools" : "Show Tools")}
                  </Button>
                </div>
              </div>
              
              {showToolsPanel && (
                <div className="mt-4 p-2 md:p-4 border rounded-md bg-muted/10">
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <h2 className="text-xs md:text-sm font-medium">利用可能なツール (APIs・関数)</h2>
                    <Button size="sm" variant="ghost" className="h-7 md:h-8 px-2 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      {isMobile ? "追加" : "ツールを追加"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                    {/* ツールの一覧はここに表示されます */}
                  </div>
                </div>
              )}
            </header>

            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className={`grid ${isMobile ? 'grid-cols-3 mb-4' : 'grid-cols-3 mb-8'}`}>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="workflows">Workflow</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
              </TabsList>
              
              {/* モバイル向けの説明テキスト */}
              {isMobile && (
                <div className="text-xs text-muted-foreground mb-4 mt-1 px-1 italic">
                  スワイプして全タブを表示
                </div>
              )}
              
              <div className="overflow-hidden">
                <TabsContent value="tasks" className="space-y-4 md:space-y-6">
                  <TaskManager />
                </TabsContent>
                <TabsContent value="workflows" className="space-y-4 md:space-y-6">
                  <WorkflowEngine />
                </TabsContent>
                <TabsContent value="agents" className="space-y-4 md:space-y-6">
                  <AgentStatusBoard />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ScrollArea>
        <Footer />
      </main>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateAgentDialogOpen} onOpenChange={setIsCreateAgentDialogOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none p-4' : 'sm:max-w-[550px]'}`}>
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
