
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Search } from "lucide-react";
import { TaskFormValues } from "../schema/taskSchema";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DynamicTaskGeneratorProps {
  onTaskGenerated: (taskData: Partial<TaskFormValues>) => void;
}

const DynamicTaskGenerator: React.FC<DynamicTaskGeneratorProps> = ({ 
  onTaskGenerated 
}) => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // 実装予定: 将来的にはAIサービスとの連携機能を追加
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedTask: Partial<TaskFormValues> = {
        name: `タスク: ${goal.split(" ").slice(0, 3).join(" ")}`,
        description: `ゴール「${goal}」を達成するために自動生成されたタスクです。\n\n詳細: ${goal}${
          searchResults.length > 0 
            ? '\n\n関連情報:\n' + searchResults.map(r => `- ${r.title}: ${r.content.substring(0, 150)}...`).join('\n')
            : ''
        }`,
        status: "pending",
        priority: "medium",
        progress: 0
      };
      
      onTaskGenerated(generatedTask);
      setSearchResults([]);
    } catch (error) {
      console.error("Error generating task:", error);
      toast({
        title: "エラーが発生しました",
        description: "タスク生成中にエラーが発生しました。",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSearch = async () => {
    if (!goal.trim()) return;
    
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: goal,
          limit: 3
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.results && data.results.length > 0) {
        setSearchResults(data.results);
        toast({
          title: "関連情報が見つかりました",
          description: `${data.results.length}件の関連知識が見つかりました`,
        });
      } else {
        toast({
          title: "関連情報なし",
          description: "関連する知識は見つかりませんでした",
        });
      }
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      toast({
        title: "検索エラー",
        description: "知識ベースの検索中にエラーが発生しました",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
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
        
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button 
            onClick={handleSearch}
            disabled={!goal.trim() || isSearching || isGenerating}
            variant="outline"
            className="flex items-center"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                検索中...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                関連情報を検索
              </>
            )}
          </Button>

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
        
        {searchResults.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">関連情報 ({searchResults.length}件)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 bg-background rounded border text-sm">
                  <p className="font-medium">{result.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{result.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DynamicTaskGenerator;
