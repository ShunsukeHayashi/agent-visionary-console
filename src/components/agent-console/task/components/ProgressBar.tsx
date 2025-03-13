
import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className = "" }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={`w-24 h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
