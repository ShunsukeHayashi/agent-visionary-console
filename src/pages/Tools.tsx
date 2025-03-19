
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Wrench, Database, Globe, Brain, MessageSquare, Calculator } from "lucide-react";

const ToolsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                  <p className="text-sm font-medium text-muted-foreground">Utilities</p>
                  <h1 className="text-2xl md:text-3xl font-bold">ツールライブラリ</h1>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">データベース接続</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    エージェントがデータベースに接続し、クエリを実行するためのインターフェース
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">ウェブ検索</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    エージェントがリアルタイムでウェブ検索を実行するためのツール
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">知識ベース</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    カスタム知識にアクセスし、クエリできるためのインターフェース
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">APIコールバック</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    外部APIとの通信を可能にするインターフェース
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">カスタムツール</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    独自のカスタムツールを作成・管理するためのインターフェース
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex flex-col h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">計算エンジン</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">
                    複雑な計算やデータ分析を実行するためのツール
                  </p>
                  <div className="text-xs bg-muted inline-flex items-center px-2 py-1 rounded">
                    開発中
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </ScrollArea>
        <Footer />
      </main>
    </div>
  );
};

export default ToolsPage;
