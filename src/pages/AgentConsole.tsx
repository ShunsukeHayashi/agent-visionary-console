
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
import { CommandType } from "@/components/agent-console/command/CommandButton";
import { Button } from "@/components/ui/Button";
import { Tool, Database, Code, Plus } from "lucide-react";

const AgentConsole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleToolsPanel = () => {
    setShowToolsPanel(!showToolsPanel);
  };

  // ツールのサンプルデータ
  const sampleTools: CommandType[] = [
    {
      id: "ocr-api",
      label: "OCR API",
      description: "画像からテキストを抽出するAPI",
      isToolCommand: true,
      toolType: "api",
      action: () => { console.log("OCR API呼び出し"); },
      order: 1,
      toolDetails: {
        input: "画像ファイル",
        output: "テキストデータ",
        example: "https://api.example.com/ocr"
      }
    },
    {
      id: "spreadsheet-api",
      label: "スプレッドシートAPI",
      description: "スプレッドシートのデータを操作",
      isToolCommand: true,
      toolType: "database",
      action: () => { console.log("スプレッドシートAPI呼び出し"); },
      order: 2
    },
    {
      id: "calc-function",
      label: "給与計算関数",
      description: "勤怠データから給与を計算",
      isToolCommand: true,
      toolType: "function",
      action: () => { console.log("給与計算関数呼び出し"); },
      order: 3
    }
  ];

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
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleToolsPanel}
                    className="flex items-center gap-2"
                  >
                    <Tool className="h-4 w-4" />
                    {showToolsPanel ? "Hide Tools" : "Show Tools"}
                  </Button>
                </div>
              </div>
              
              {showToolsPanel && (
                <div className="mt-4 p-4 border rounded-md bg-muted/10">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-medium">利用可能なツール (APIs・関数)</h2>
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      ツールを追加
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {sampleTools.map((tool) => (
                      <div key={tool.id} className="border rounded-md p-3 bg-card hover:shadow-sm transition-shadow">
                        <div className="flex items-start">
                          {tool.toolType === 'api' && <Code className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />}
                          {tool.toolType === 'database' && <Database className="h-4 w-4 mr-2 mt-0.5 text-green-500" />}
                          {tool.toolType === 'function' && <Tool className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />}
                          <div>
                            <h3 className="text-sm font-medium">{tool.label}</h3>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                            {tool.toolDetails && (
                              <div className="mt-2 text-xs">
                                {tool.toolDetails.input && <p>Input: {tool.toolDetails.input}</p>}
                                {tool.toolDetails.output && <p>Output: {tool.toolDetails.output}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default AgentConsole;
