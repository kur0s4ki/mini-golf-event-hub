
import React from "react";
import { Badge } from "lucide-react";

interface WaitingScreenProps {
  className?: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full p-8 ${className}`}>
      <div className="glass-panel rounded-3xl p-12 max-w-md w-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="relative">
          <Badge size={64} className="text-primary animate-pulse-slow" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping-slow"></div>
        </div>
        
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-medium tracking-tight">Minigolf Game</h1>
          <p className="text-lg text-muted-foreground">
            Please badge to start
          </p>
        </div>
        
        <div className="w-16 h-1 bg-muted rounded-full mt-6 animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default WaitingScreen;
