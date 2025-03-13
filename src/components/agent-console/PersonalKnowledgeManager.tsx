
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Database, Save, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PersonalKnowledgeManagerProps {
  agentId?: string;
}

const PersonalKnowledgeManager: React.FC<PersonalKnowledgeManagerProps> = ({
  agentId
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  // ナレッジの保存
  const saveKnowledge = async () => {
    if (!title || !content) {
      toast({
        title: "入力エラー",
        description: "タイトルと内容を入力してください",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Edge Functionを使用してエンベディングを生成し保存
      const { data, error } = await supabase.functions.invoke('embed-text', {
        body: {
          title,
          content,
          metadata: {
            agent_id: agentId || "personal",
            source: "manual_entry"
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "保存完了",
        description: "ナレッジが正常に保存されました",
      });

      // フォームをリセット
      setTitle("");
      setContent("");
      
    } catch (error) {
      console.error("知識保存エラー:", error);
      toast({
        title: "エラーが発生しました",
        description: "ナレッジの保存中にエラーが発生しました。",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ナレッジの検索
  const searchKnowledge = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: searchQuery,
          limit: 5
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.results && data.results.length > 0) {
        setSearchResults(data.results);
        toast({
          title: "検索完了",
          description: `${data.results.length}件の関連ナレッジが見つかりました`,
        });
      } else {
        toast({
          title: "検索結果",
          description: "関連するナレッジは見つかりませんでした",
        });
      }
    } catch (error) {
      console.error("検索エラー:", error);
      toast({
        title: "検索エラー",
        description: "検索中にエラーが発生しました",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // ナレッジの削除
  const deleteKnowledge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSearchResults(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "削除完了",
        description: "ナレッジが正常に削除されました",
      });
    } catch (error) {
      console.error("削除エラー:", error);
      toast({
        title: "削除エラー",
        description: "ナレッジの削除中にエラーが発生しました",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          パーソナルナレッジマネージャー
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="ナレッジのタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="ナレッジの内容..."
              className="h-32 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button
            onClick={saveKnowledge}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                ナレッジを保存
              </>
            )}
          </Button>
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="検索キーワード..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchKnowledge()}
            />
            <Button
              variant="outline"
              onClick={searchKnowledge}
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 bg-secondary/10 rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteKnowledge(result.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {result.content.substring(0, 200)}
                    {result.content.length > 200 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalKnowledgeManager;
