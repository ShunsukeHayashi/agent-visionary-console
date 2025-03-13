
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

const DemoLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      // 実存するドメインを持つ有効なメールアドレス形式を使用
      const demoEmail = "demo.user@gmail.com";
      const demoPassword = "demo12345";
      
      // まず既存のデモユーザーでログインを試みる
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (error) {
        // デモユーザーが存在しない場合は作成
        if (error.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                is_demo_user: true
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          toast({
            title: "デモアカウント作成",
            description: "デモアカウントを作成しました。自動的にログインします。",
          });
          
          // 再度ログイン試行
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      
      toast({
        title: "デモログイン成功",
        description: "デモアカウントでログインしました。",
      });
      
      navigate("/agent-console");
    } catch (error: any) {
      console.error("デモログインエラー:", error);
      
      toast({
        variant: "destructive",
        title: "デモログインエラー",
        description: "デモアカウントでのログイン中にエラーが発生しました。Supabaseの管理画面でメール確認が無効になっていることを確認してください。",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleDemoLogin}
      disabled={loading}
    >
      {loading ? "ログイン中..." : "デモアカウントでログイン"}
    </Button>
  );
};

export default DemoLoginButton;
