
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardCard from "./DashboardCard";
import { Button } from "../ui/Button";

// Mock data for the chart
const data = [
  { name: "Mon", requests: 400, success: 380 },
  { name: "Tue", requests: 560, success: 530 },
  { name: "Wed", requests: 620, success: 600 },
  { name: "Thu", requests: 800, success: 750 },
  { name: "Fri", requests: 750, success: 720 },
  { name: "Sat", requests: 450, success: 430 },
  { name: "Sun", requests: 300, success: 290 },
];

const PerformanceChart: React.FC = () => {
  return (
    <DashboardCard className="animate-in h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Weekly agent activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Day</Button>
          <Button variant="primary" size="sm">Week</Button>
          <Button variant="outline" size="sm">Month</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 8, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }} 
            />
            <Bar 
              dataKey="requests" 
              name="Total Requests" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="success" 
              name="Successful" 
              fill="hsl(var(--primary) / 0.3)" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default PerformanceChart;
