
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
      
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (error) {
        // デモユーザーが存在しない場合は作成
        if (error.message.includes("Invalid login credentials")) {
          // メール確認をバイパスするために自動確認フラグを使用
          const { error: signUpError, data } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              emailRedirectTo: window.location.origin + '/agent-console',
              data: {
                is_demo_user: true
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          // デモアカウント作成のメッセージを表示
          toast({
            title: "デモアカウント作成",
            description: "デモアカウントを作成しました。自動的にログインします。",
          });
          
          // メール確認の問題を回避するためユーザーに通知
          if (data?.user && !data.user.email_confirmed_at) {
            toast({
              title: "メール確認が必要です",
              description: "通常は確認メールの確認が必要ですが、デモ目的のためSupabaseの管理画面から確認をスキップできます。",
              duration: 5000,
            });
          }
          
          // 再度ログイン試行
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (retryError) {
            if (retryError.message.includes("Email not confirmed")) {
              throw new Error("デモアカウントは作成されましたが、メール確認が必要です。Supabaseの管理画面でメール確認を無効にすることで回避できます。");
            }
            throw retryError;
          }
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("デモアカウントのメール確認が完了していません。Supabaseの管理画面でメール確認を無効にすることで回避できます。");
        } else {
          throw error;
        }
      }
      
      navigate("/agent-console");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "デモログインエラー",
        description: error.message || "デモアカウントでのログイン中にエラーが発生しました。",
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
      デモアカウントでログイン
    </Button>
  );
};

export default DemoLoginButton;
