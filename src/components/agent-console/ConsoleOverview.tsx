
import React from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

const ConsoleOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <DashboardCard>
        <h2 className="text-lg font-semibold mb-4">AI Agent Console</h2>
        <p className="text-muted-foreground">
          ここでは、AI エージェントを管理し、タスクの作成やワークフローの設定を行うことができます。
          左側のタブから必要な機能を選択してください。
        </p>
      </DashboardCard>
    </div>
  );
};

export default ConsoleOverview;
