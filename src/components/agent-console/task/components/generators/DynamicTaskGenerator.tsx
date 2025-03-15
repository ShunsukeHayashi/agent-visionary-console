
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Search, ListChecks } from "lucide-react";
import { TaskFormValues } from "../../schema/taskSchema";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";

interface DynamicTaskGeneratorProps {
  onTaskGenerated: (taskData: Partial<TaskFormValues>) => void;
}

// サブタスクの型定義
interface Subtask {
  name: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
}

const DynamicTaskGenerator: React.FC<DynamicTaskGeneratorProps> = ({ 
  onTaskGenerated 
}) => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [generateSubtasks, setGenerateSubtasks] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // タスクデータを格納する変数
      let taskResponse: {
        success: boolean;
        task: {
          name: string;
          description: string;
          status: string;
          priority: string;
          progress: number;
        };
        subtasks: Subtask[];
      };
      
      try {
        // Edge Functionを呼び出してタスクを生成
        const { data, error } = await supabase.functions.invoke('generate-tasks-from-goal', {
          body: {
            goal: goal,
            generateSubtasks: generateSubtasks,
            subtaskCount: 3,
            relatedInfo: searchResults
          }
        });
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('タスク生成に失敗しました');
        }
        
        if (!data.success) {
          console.warn('Edge Function returned unsuccessful response:', data);
          throw new Error('タスク生成に失敗しました');
        }
        
        taskResponse = data;
      } catch (invokeError) {
        console.error("Edge Function invoke error:", invokeError);
        
        // CORSエラーの可能性がある場合の代替処理
        // 簡易的なタスクデータを生成
        console.log("Falling back to client-side task generation due to Edge Function error");
        
        // 簡易的なタスクデータを生成
        taskResponse = {
          success: true,
          task: {
            name: `タスク: ${goal.substring(0, 30)}${goal.length > 30 ? '...' : ''}`,
            description: goal,
            status: "pending",
            priority: "medium",
            progress: 0
          },
          subtasks: generateSubtasks ? [
            {
              name: "サブタスク 1",
              description: "このサブタスクの詳細を入力してください",
              status: "pending",
              priority: "medium",
              progress: 0
            },
            {
              name: "サブタスク 2",
              description: "このサブタスクの詳細を入力してください",
              status: "pending",
              priority: "medium",
              progress: 0
            },
            {
              name: "サブタスク 3",
              description: "このサブタスクの詳細を入力してください",
              status: "pending",
              priority: "medium",
              progress: 0
            }
          ] : []
        };
      }
      
      // メインタスクのデータを取得
      const taskData = taskResponse.task;
      
      // 思考ステージの情報を含まない、基本的なタスクデータのみを作成
      // これにより、データベーススキーマの問題を回避
      const generatedTask: Partial<TaskFormValues> = {
        name: taskData.name,
        description: taskData.description,
        status: taskData.status || "pending",
        priority: taskData.priority || "medium",
        progress: taskData.progress || 0
      };
      
      // 注: 思考ステージのデータは一時的に無視
      // データベースにカラムが追加された後に再度有効化できます
      
      // サブタスクがある場合は保存
      if (taskResponse.subtasks && taskResponse.subtasks.length > 0) {
        setSubtasks(taskResponse.subtasks);
        setShowSubtasks(true);
      } else {
        setSubtasks([]);
        setShowSubtasks(false);
      }
      
      // 親コンポーネントにタスクデータを渡す
      onTaskGenerated(generatedTask);
      setSearchResults([]);
    } catch (error) {
      console.error("Error generating task:", error);
      
      // エラーメッセージをより具体的に
      let errorMessage = "タスク生成中にエラーが発生しました。";
      
      // CORSエラーの場合は特定のメッセージを表示
      if (error instanceof Error && error.message.includes('CORS')) {
        errorMessage = "CORSポリシーによりリクエストがブロックされました。Supabase Edge Functionの設定を確認してください。";
      }
      
      toast({
        title: "エラーが発生しました",
        description: errorMessage,
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
      } catch (invokeError) {
        console.error("Edge Function invoke error:", invokeError);
        
        // CORSエラーの可能性がある場合の代替処理
        console.log("Falling back to empty search results due to Edge Function error");
        
        // 空の検索結果を設定
        setSearchResults([]);
        
        // CORSエラーの場合は特定のメッセージを表示
        let errorMessage = "知識ベースの検索中にエラーが発生しました";
        if (invokeError instanceof Error && invokeError.message.includes('CORS')) {
          errorMessage = "CORSポリシーによりリクエストがブロックされました。Supabase Edge Functionの設定を確認してください。";
        }
        
        toast({
          title: "検索エラー",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in search handler:", error);
      toast({
        title: "検索エラー",
        description: "知識ベースの検索中に予期しないエラーが発生しました",
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
        
        <div className="flex items-center space-x-2">
          <Switch
            id="generate-subtasks"
            checked={generateSubtasks}
            onCheckedChange={setGenerateSubtasks}
          />
          <Label htmlFor="generate-subtasks" className="text-sm">サブタスクも生成する</Label>
        </div>
        
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
        
        {showSubtasks && subtasks.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <ListChecks className="h-4 w-4 mr-2" />
              生成されたサブタスク ({subtasks.length}件)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subtasks.map((subtask, index) => (
                <div key={index} className="p-2 bg-background rounded border text-sm">
                  <p className="font-medium">{subtask.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{subtask.description}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                      {subtask.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              注: サブタスクは現在表示のみです。将来的にはタスク作成時に自動的に登録される予定です。
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DynamicTaskGenerator;
