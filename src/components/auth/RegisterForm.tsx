
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const RegisterForm = ({ email, setEmail, password, setPassword }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "アカウント作成完了",
        description: "確認メールを送信しました。メールを確認してください。",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error.message || "サインアップ中にエラーが発生しました。",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="register-email" className="text-sm font-medium">メールアドレス</label>
        <Input
          id="register-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">パスワード</label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">パスワードは8文字以上にしてください</p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "アカウント作成中..." : "アカウント作成"}
      </Button>
    </form>
  );
};

export default RegisterForm;
