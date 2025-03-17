
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
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (signInError) {
        console.log("ログインエラー:", signInError.message);
        
        // デモユーザーが存在しない場合は作成
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                is_demo_user: true
              }
            }
          });
          
          if (signUpError) {
            console.error("サインアップエラー:", signUpError);
            throw signUpError;
          }
          
          // メール確認が必要な場合のエラーチェック
          if (signUpData?.user && !signUpData.session) {
            toast({
              title: "メール確認が必要です",
              description: "Supabaseの管理画面でメール確認設定を無効にしてください。",
              duration: 5000,
            });
            throw new Error("Email confirmation required");
          }
          
          toast({
            title: "デモアカウント作成成功",
            description: "デモアカウントでログインしました。",
          });
          
          navigate("/console");
          return;
        } else if (signInError.message.includes("Email not confirmed")) {
          // メール確認エラーの場合
          toast({
            variant: "destructive",
            title: "メール確認が必要です",
            description: "Supabaseの管理画面でメール確認設定を無効にしてください。",
            duration: 5000,
          });
          throw new Error("Email confirmation required");
        } else {
          throw signInError;
        }
      }
      
      // ログイン成功
      if (signInData?.session) {
        toast({
          title: "デモログイン成功",
          description: "デモアカウントでログインしました。",
        });
        
        navigate("/console");
      }
    } catch (error: any) {
      console.error("デモログインエラー:", error);
      
      // すでにエラーメッセージが表示されている場合は重複して表示しない
      if (!error.message.includes("Email confirmation required")) {
        toast({
          variant: "destructive",
          title: "デモログインエラー",
          description: "Supabaseの管理画面でメール確認が無効になっていることを確認してください。",
        });
      }
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
