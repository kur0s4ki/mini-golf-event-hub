
import React from "react";
import { Globe } from "lucide-react";

interface WaitingScreenProps {
  className?: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center h-full w-full ${className}`}>
      {/* Main container with teal background */}
      <div className="w-full h-full bg-[#2A9D8F] p-8 flex flex-col items-center justify-center">
        
        {/* Center content with purple background and orange border */}
        <div className="relative max-w-3xl w-full rounded-xl bg-[#4A1D96] border-4 border-[#F4A261] p-6 flex flex-col items-center justify-center">
          {/* Background pattern - golf clubs and circles */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
            <div className="w-full h-full opacity-10 bg-repeat" style={{ 
              backgroundImage: "url('public/lovable-uploads/70ede128-d779-4064-b320-65c7f9359c1b.png')" 
            }}></div>
          </div>
          
          {/* Logo and title */}
          <div className="relative z-10 mb-8 text-center">
            <img 
              src="public/lovable-uploads/7e00f181-d0bd-4c84-b12c-5c19af1ec00f.png" 
              alt="The MIND golf" 
              className="w-full max-w-md mx-auto"
            />
          </div>
          
          {/* Touch to begin button */}
          <button className="relative z-10 px-12 py-3 text-2xl font-bold text-[#F4A261] bg-[#2A9D8F] rounded-full border-4 border-[#F4A261] shadow-lg transform transition-transform hover:scale-105 mb-4">
            TOUCH TO BEGIN
          </button>
        </div>

        {/* Footer with language selector */}
        <div className="absolute bottom-8 left-8">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-[#F4A261]">
            <Globe size={24} className="text-[#F4A261]" />
            <span className="text-white font-medium">EN</span>
          </div>
        </div>

        {/* Help button */}
        <div className="absolute bottom-8 right-8">
          <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border-2 border-[#F4A261]">
            <span className="text-[#F4A261] font-bold text-xl">?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
