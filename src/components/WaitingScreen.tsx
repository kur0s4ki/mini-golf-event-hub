
import React from "react";
import { Globe } from "lucide-react";

interface WaitingScreenProps {
  className?: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center h-full w-full ${className}`}>
      {/* Main container with teal background - full width and height of viewport */}
      <div className="fixed inset-0 bg-[#2A9D8F] flex flex-col items-center justify-center p-8">
        
        {/* Center content with purple background image and orange border */}
        <div className="relative max-w-3xl w-full rounded-xl border-4 border-[#F4A261] p-6 flex flex-col items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="public/lovable-uploads/70578374-a208-4dee-9566-0841fe903885.png" 
              alt="Background pattern" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Logo and title */}
          <div className="relative z-10 mb-16 text-center">
            <img 
              src="public/lovable-uploads/7e00f181-d0bd-4c84-b12c-5c19af1ec00f.png" 
              alt="The MIND golf" 
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>

        {/* Touch to begin button - positioned to be half in and half out of the purple box */}
        <div className="relative z-20 -mt-12">
          <button className="px-16 py-4 text-2xl font-bold text-[#F4A261] bg-[#2A9D8F] rounded-full border-4 border-[#F4A261] shadow-lg transform transition-transform hover:scale-105">
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
