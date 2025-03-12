
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatusCard from "@/components/dashboard/StatusCard";
import AgentsList from "@/components/dashboard/AgentsList";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/Button";
import { Activity, Bot, Brain, Server, Plus } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      <main className="pt-16 md:pl-64 transition-all duration-300">
        <div className="container py-8 px-4 md:px-8 max-w-[1600px]">
          <header className="mb-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
                <h1 className="text-2xl md:text-3xl font-bold">AI Agent Console</h1>
              </div>
              <Button variant="primary" className="w-full md:w-auto shrink-0 slide-up" style={{ animationDelay: '200ms' }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Agent
              </Button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="slide-up" style={{ animationDelay: '100ms' }}>
              <StatusCard
                title="Active Agents"
                value={loading ? "" : "16"}
                icon={Bot}
                change={5}
                changeText="vs last week"
                loading={loading}
              />
            </div>
            <div className="slide-up" style={{ animationDelay: '200ms' }}>
              <StatusCard
                title="Total Requests"
                value={loading ? "" : "2,841"}
                icon={Activity}
                change={12}
                changeText="vs last week"
                loading={loading}
              />
            </div>
            <div className="slide-up" style={{ animationDelay: '300ms' }}>
              <StatusCard
                title="Success Rate"
                value={loading ? "" : "97.3%"}
                icon={Brain}
                change={2}
                changeText="vs last week"
                loading={loading}
              />
            </div>
            <div className="slide-up" style={{ animationDelay: '400ms' }}>
              <StatusCard
                title="API Usage"
                value={loading ? "" : "68%"}
                icon={Server}
                change={8}
                changeText="trending up"
                positive={false}
                loading={loading}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 slide-up" style={{ animationDelay: '300ms' }}>
              <PerformanceChart />
            </div>
            <div className="slide-up" style={{ animationDelay: '400ms' }}>
              <AgentsList />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
