
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Sparkles, User, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgentAvatarProps {
  agentName: string;
  agentType: string;
  agentDescription?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onAvatarGenerated?: (url: string) => void;
  showGenerateButton?: boolean;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentName,
  agentType,
  agentDescription = "",
  avatarUrl,
  size = "md",
  onAvatarGenerated,
  showGenerateButton = false
}) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | undefined>(avatarUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };
  
  // Get initials for the fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const generateAvatar = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-agent-image', {
        body: { agentName, agentType, agentDescription }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        if (onAvatarGenerated) {
          onAvatarGenerated(data.imageUrl);
        }
        
        toast({
          title: "画像を生成しました",
          description: "エージェントのアバターを生成しました。",
        });
      }
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast({
        title: "画像生成エラー",
        description: "アバターの生成中にエラーが発生しました。後でもう一度お試しください。",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Avatar className={sizeClasses[size]}>
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={agentName} />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(agentName) || <User className="h-6 w-6" />}
          </AvatarFallback>
        )}
      </Avatar>
      
      {showGenerateButton && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 text-xs"
          onClick={generateAvatar}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              生成中...
            </>
          ) : imageUrl ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              再生成
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              画像を生成
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AgentAvatar;
