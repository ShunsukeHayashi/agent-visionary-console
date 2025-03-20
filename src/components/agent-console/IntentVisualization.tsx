import React from 'react';

interface IntentVisualizationProps {
  content: string;
  type?: 'input' | 'intent' | 'goal' | 'task' | 'agent';
  className?: string;
}

/**
 * IntentVisualization Component
 * 
 * Displays content with ◤◢◤◢ border markers for intent analysis visualization.
 * This component follows the specific format required for the Visionary Console.
 */
const IntentVisualization: React.FC<IntentVisualizationProps> = ({
  content,
  type = 'intent',
  className = '',
}) => {
  // Get the appropriate label based on the type
  const getLabel = () => {
    switch (type) {
      case 'input':
        return 'User Input';
      case 'intent':
        return 'Intent Analysis';
      case 'goal':
        return 'Fixed Goal';
      case 'task':
        return 'Task Breakdown';
      case 'agent':
        return 'Agent Assignment';
      default:
        return 'Intent Analysis';
    }
  };

  return (
    <div className={`my-4 ${className}`}>
      <div className="text-sm text-muted-foreground mb-1">
        {getLabel()}
      </div>
      <div className="border border-primary/30 rounded-md p-4 bg-primary/5">
        <div className="text-xs font-mono mb-2">◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢</div>
        <div className="whitespace-pre-wrap">{content}</div>
        <div className="text-xs font-mono mt-2">◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢</div>
      </div>
    </div>
  );
};

export default IntentVisualization;
