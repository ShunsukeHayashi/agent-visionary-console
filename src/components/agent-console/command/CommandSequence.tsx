
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowDownCircle, ListOrdered } from "lucide-react";
import CommandButton, { CommandType } from "./CommandButton";
import { Progress } from "@/components/ui/progress";

interface CommandSequenceProps {
  initialCommands: CommandType[];
  onSequenceComplete: (contextChain: string[]) => void;
}

const CommandSequence: React.FC<CommandSequenceProps> = ({
  initialCommands,
  onSequenceComplete
}) => {
  const [commands, setCommands] = useState<CommandType[]>(initialCommands);
  const [activeCommandIndex, setActiveCommandIndex] = useState<number>(0);
  const [executedCommands, setExecutedCommands] = useState<number[]>([]);
  const [contextChain, setContextChain] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressPercentage = (executedCommands.length / commands.length) * 100;
    setProgress(progressPercentage);
    
    if (executedCommands.length === commands.length && commands.length > 0) {
      onSequenceComplete(contextChain);
    }
  }, [executedCommands, commands, contextChain, onSequenceComplete]);

  const executeCommand = (commandId: string) => {
    const commandIndex = commands.findIndex(cmd => cmd.id === commandId);
    if (commandIndex === activeCommandIndex) {
      // 実行するコマンドを見つける
      const commandToExecute = commands[commandIndex];
      
      // コマンドのアクションを実行
      commandToExecute.action();
      
      // 実行済みコマンドリストに追加
      setExecutedCommands([...executedCommands, commandIndex]);
      
      // コンテキストチェーンに追加
      setContextChain([...contextChain, commandToExecute.label]);
      
      // 次のコマンドをアクティブに
      if (commandIndex < commands.length - 1) {
        setActiveCommandIndex(commandIndex + 1);
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ListOrdered className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">コマンドシーケンス</h3>
        </div>
        <Badge variant="outline" className="flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-primary" />
          {executedCommands.length}/{commands.length}ステップ
        </Badge>
      </div>
      
      <Progress value={progress} className="h-2 mb-4" />
      
      <ScrollArea className="h-[320px] pr-3">
        <div className="space-y-2">
          {commands.map((command, index) => (
            <CommandButton
              key={command.id}
              command={command}
              isActive={index === activeCommandIndex}
              isNext={index === activeCommandIndex}
              onExecute={() => executeCommand(command.id)}
            />
          ))}
        </div>
      </ScrollArea>
      
      {contextChain.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center mb-2">
            <ArrowDownCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">
              コンテキストチェーン
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {contextChain.join(" → ")}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CommandSequence;
