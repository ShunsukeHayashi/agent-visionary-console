
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import PersonalGrowableAgent from "@/components/agent-console/PersonalGrowableAgent";

const PersonalAgentPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">パーソナルエージェント</h1>
            <PersonalGrowableAgent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalAgentPage;
