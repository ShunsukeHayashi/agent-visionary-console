
import React from "react";
import { Button } from "@/components/ui/Button";

interface AgentFormFooterProps {
  onCancel: () => void;
  isDynamicGeneration: boolean;
}

const AgentFormFooter: React.FC<AgentFormFooterProps> = ({
  onCancel,
  isDynamicGeneration
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        キャンセル
      </Button>
      <Button type="submit">
        {isDynamicGeneration ? "動的生成" : "作成"}
      </Button>
    </div>
  );
};

export default AgentFormFooter;
