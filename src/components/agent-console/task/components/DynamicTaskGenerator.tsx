
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { TaskFormValues } from "../schema/taskSchema";

interface DynamicTaskGeneratorProps {
  onTaskGenerated: (taskData: Partial<TaskFormValues>) => void;
}

const DynamicTaskGenerator: React.FC<DynamicTaskGeneratorProps> = ({ 
  onTaskGenerated 
}) => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // 実際のプロダクションでは、AIサービスとの連携が必要です
      // ここではモックデータを使用します
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedTask: Partial<TaskFormValues> = {
        name: `タスク: ${goal.split(" ").slice(0, 3).join(" ")}`,
        description: `ゴール「${goal}」を達成するために自動生成されたタスクです。\n\n詳細: ${goal}`,
        status: "pending",
        priority: "medium",
        progress: 0
      };
      
      onTaskGenerated(generatedTask);
    } catch (error) {
      console.error("Error generating task:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="p-4 border border-dashed border-primary/50 bg-primary/5">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        ゴールから動的にタスクを生成
      </h3>
      
      <div className="space-y-4">
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="達成したい目標を詳しく入力してください..."
          className="h-24 resize-none"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={!goal.trim() || isGenerating}
            className="flex items-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                タスクを生成
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DynamicTaskGenerator;
