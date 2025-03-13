
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrowableAgent from "./GrowableAgent";
import PersonalKnowledgeManager from "./PersonalKnowledgeManager";
import { Card } from "@/components/ui/card";
import { User, Brain, Database, Settings } from "lucide-react";

interface PersonalGrowableAgentProps {
  userId?: string;
  agentId?: string;
}

const PersonalGrowableAgent: React.FC<PersonalGrowableAgentProps> = ({ 
  userId, 
  agentId 
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">パーソナル成長型エージェント</h2>
      </div>
      
      <Tabs defaultValue="agent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agent" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            エージェント
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            ナレッジ管理
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="agent" className="mt-4">
          <GrowableAgent agentId={agentId} />
        </TabsContent>
        
        <TabsContent value="knowledge" className="mt-4">
          <PersonalKnowledgeManager agentId={agentId} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">設定</h3>
            <p className="text-muted-foreground">
              MVPバージョンのため、詳細設定は次回のアップデートで実装予定です。
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PersonalGrowableAgent;
