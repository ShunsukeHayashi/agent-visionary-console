
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
          const { error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (signUpError) throw signUpError;
          
          // デモアカウント作成のメッセージを表示
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
