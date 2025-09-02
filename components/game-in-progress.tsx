"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Globe,
  Gift,
  Star,
  Plus,
  Gem,
  Flag,
  Trophy,
  Target,
  Lightbulb,
} from "lucide-react";
import { gameEvents } from "@/lib/eventEmitter";

interface GameInProgressProps {
  className?: string;
  initialTime?: number;
  gameName?: string;
  instructions?: string;
  playerName?: string;
  teamName?: string; // Add teamName prop
  difficulty?: string;
  hideControls?: boolean; // New prop to hide admin controls
}

interface BackgroundElement {
  top: string;
  left: string;
  size: string;
  rotation: string;
  opacity: number;
  type: "ball" | "flag" | "trophy" | "target";
}

const GameInProgress: React.FC<GameInProgressProps> = ({
  className,
  initialTime = 20, // 20 seconds
  gameName,
  instructions,
  playerName,
  teamName, // Add teamName to destructuring
  difficulty = "Easy",
  hideControls = false, // Default to showing controls
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [showBonus, setShowBonus] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [bonusScale, setBonusScale] = useState(0);
  const [bonusCountdown, setBonusCountdown] = useState(5);
  const [bgElements, setBgElements] = useState<BackgroundElement[]>([]);
  const [bonusPoints, setBonusPoints] = useState<number>(10); // default to 10 for consistency

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Calculate a minimal score when time's up
          const baseScore = 100;
          gameEvents.emit("timeUp", baseScore + totalScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalScore]);

  useEffect(() => {
    // Generate static background elements only on the client side
    const elements = Array.from({ length: 40 }, (_, index) => {
      // Distribute elements across the screen
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      // Randomize sizes but keep them small
      const size = `${1 + Math.random() * 1.5}rem`;
      // Random rotation
      const rotation = `${Math.random() * 360}deg`;
      // Random opacity but keep them subtle
      const opacity = 0.03 + Math.random() * 0.12;
      // Select icon type
      const typeIndex = Math.floor(Math.random() * 4);
      const types = ["ball", "flag", "trophy", "target"] as const;
      return {
        top,
        left,
        size,
        rotation,
        opacity,
        type: types[typeIndex],
      };
    });
    setBgElements(elements);
  }, []);

  useEffect(() => {
    // Listen for bonus events from websocket
    const handleBonus = (points: number) => {
      setBonusPoints(points || 10); // always show the correct amount
      setShowBonus(true);
      setTotalScore((prev) => prev + (points || 0));
    };
    gameEvents.on("bonus", handleBonus);
    return () => {
      gameEvents.off("bonus", handleBonus);
    };
  }, []);

  // Bonus animation effect
  useEffect(() => {
    if (!showBonus) return;

    // Entrance animation
    setBonusScale(0);
    setTimeout(() => {
      setBonusScale(1);
    }, 100);

    // Countdown to auto-hide
    setBonusCountdown(5);
    const timer = setInterval(() => {
      setBonusCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // First fade out the animation
          setBonusScale(0);
          // Then hide the bonus overlay
          setTimeout(() => {
            setShowBonus(false);
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBonus]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Determine if time is running low (10 seconds or less)
  const isTimeLow = timeRemaining <= 10;

  // Determine if time is critically low (5 seconds or less)
  const isCritical = timeRemaining <= 5;

  // Handle OK button click to go to win screen
  const handleOkClick = () => {
    // Only emit the current score, do not add extra points
    gameEvents.emit("win", totalScore);
  };

  // Handle BONUS button click
  const handleBonusClick = () => {
    gameEvents.emit("bonus", 10);
  };

  // Handle back button click
  const handleBackClick = () => {
    gameEvents.emit("reset", null);
  };

  // Generate sparkle elements for the bonus effect
  const sparkles = Array.from({ length: 50 }, (_, index) => ({
    id: index,
    top: `${Math.random() * 200 - 50}%`,
    left: `${Math.random() * 200 - 50}%`,
    size: `${3 + Math.random() * 10}px`,
    color: Math.random() > 0.5 ? "#FFD166" : "#229954",
    animationDuration: `${0.5 + Math.random()}s`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="min-h-screen h-screen w-full bg-gradient-to-br bg-[#FFA500] flex flex-col overflow-hidden">
      {/* BARRE DE NAVIGATION */}
      <div
        className="w-full flex items-center justify-between px-12 py-5 md:py-5 bg-gradient-to-r bg-[#FFA500] border-b-4 border-[#FFD166] shadow-lg z-30"
        style={{ flex: "0 0 auto" }}
      >
        <div className="font-badtyp text-2xl md:text-4xl text-white flex items-center gap-2 md:gap-3">
          <Flag className="w-6 h-6 md:w-8 md:h-8 text-[#FFD166]" /> MINI{" "}
          <span className="text-[#FFD166]">Golf</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={`font-badtyp text-3xl md:text-5xl tracking-wide ${
              isCritical
                ? "text-red-500 animate-flash"
                : isTimeLow
                ? "text-[#FFD166]"
                : "text-white"
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
          <span className="text-white/70 text-base md:text-lg font-badtyp tracking-wider mt-1">
            TEMPS RESTANT
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-badtyp text-2xl md:text-4xl text-white">
            Score
          </span>
          <span
            className="font-badtyp text-3xl md:text-5xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] bg-[#FFD166] bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: "2px #FFD166",
              filter: "drop-shadow(0 1px 8px #000)",
            }}
          >
            {totalScore}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT - shrink card and spacing for fit */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
        {/* Background icons (subtle) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {bgElements.map((element, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: element.top,
                left: element.left,
                width: element.size,
                height: element.size,
                opacity: element.opacity,
                transform: `rotate(${element.rotation})`,
              }}
            >
              {element.type === "flag" && (
                <Flag
                  className="text-white"
                  style={{ width: element.size, height: element.size }}
                />
              )}
              {element.type === "trophy" && (
                <Trophy
                  className="text-white"
                  style={{ width: element.size, height: element.size }}
                />
              )}
              {element.type === "target" && (
                <Target
                  className="text-white"
                  style={{ width: element.size, height: element.size }}
                />
              )}
            </div>
          ))}
        </div>

        {/* MAIN INFO CARD - fixed height without scrolling */}
        {!showBonus && (
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-2 md:gap-4 bg-black/70 rounded-2xl border-4 border-[#FFD166] shadow-2xl px-4 md:px-10 py-5 md:py-8 mt-4 mb-4 md:mt-6 md:mb-6 h-auto">
            {/* Team Name Sticker - Enhanced visibility */}
            <div className="absolute right-0 top-0 transform rotate-6 bg-[#E76F51] px-4 md:px-6 py-2 md:py-3 rounded-lg border-4 border-white shadow-xl z-50">
              <div className="flex flex-col items-center">
                <span className="text-white font-badtyp text-xs md:text-sm uppercase tracking-wider">
                  ÉQUIPE
                </span>
                <span className="text-white font-badtyp text-lg md:text-2xl drop-shadow-lg">
                  {teamName || "Aigles"}
                </span>
              </div>
            </div>

            {/* Player */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[#FFD166] font-badtyp text-sm md:text-xl tracking-widest uppercase">
                GOLFEUR
              </span>
              <span className="text-white font-badtyp text-lg md:text-3xl drop-shadow-lg animate-pop-in">
                {playerName || "Jean Dupont"}
              </span>
            </div>
            {/* Game Name */}
            <div className="flex flex-col items-center gap-1 mt-1 md:mt-2">
              <span className="text-white/70 font-badtyp text-sm md:text-xl tracking-widest uppercase">
                JEU
              </span>
              <span className="text-white font-badtyp text-lg md:text-3xl drop-shadow-xl animate-pop-in">
                {gameName || "Super Mini Golf"}
              </span>
            </div>
            {/* Instructions with reduced height */}
            <div className="flex flex-col items-center gap-1 w-full mt-2 md:mt-3">
              <span className="text-[#FFD166] font-badtyp text-sm md:text-xl tracking-widest uppercase flex items-center gap-2">
                <Lightbulb className="w-3 h-3 md:w-5 md:h-5 text-[#FFD166]" />
                CONSIGNES DE JEU
              </span>
              <div className="w-full h-[120px] md:h-[180px] bg-[#FFA500]/30 rounded-2xl border-4 border-white shadow-lg">
                <div className="w-full h-full flex items-center justify-center px-3 md:px-6 py-3 md:py-6">
                  <p className="text-white font-badtyp text-base md:text-2xl text-center animate-fade-in">
                    {instructions ||
                      "Visez le trou en un minimum de coups. Utilisez les rebonds pour éviter les obstacles !"}
                  </p>
                </div>
              </div>
            </div>
            {/* Difficulty */}
            <div className="flex flex-col items-center gap-1 mt-2 md:mt-3">
              <span className="text-[#E76F51] font-badtyp text-lg md:text-2xl tracking-widest uppercase mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-[#E76F51]" />
                DIFFICULTÉ
              </span>
              <div className="flex gap-1">
                <span className="text-white text-xl md:text-3xl">▲</span>
                <span className="text-white text-xl md:text-3xl">▲</span>
                <span className="text-white text-xl md:text-3xl">▲</span>
                <span className="text-white text-xl md:text-3xl opacity-30">
                  ▲
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BONUS OVERLAY */}
        {showBonus && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {/* Sparkle animations */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transform: "scale(1.10)" }} // makes sparkles larger too
            >
              {sparkles.map((sparkle) => (
                <div
                  key={sparkle.id}
                  className="absolute sparkle animate-sparkle"
                  style={{
                    top: sparkle.top,
                    left: sparkle.left,
                    width: sparkle.size,
                    height: sparkle.size,
                    backgroundColor: sparkle.color,
                    borderRadius: "50%",
                    opacity: 0,
                    transform: "scale(0)",
                    animationDelay: sparkle.animationDelay,
                    animationDuration: sparkle.animationDuration,
                  }}
                />
              ))}
            </div>

            {/* Bonus message and points now in column */}
            <div
              className="flex flex-col items-center justify-center gap-6 transition-all duration-700"
              // ensure bonusScale is treated as a number, then multiply for bigger visual size
              style={{ transform: `scale(${(Number(bonusScale) || 1) * 1.2})` }}
            >
              <div className="text-white font-badtyp text-3xl md:text-5xl mb-4 animate-bounce-slow">
                BONUS!
              </div>

              <div className="relative flex flex-col items-center justify-center gap-6">
                {/* Background glow, larger */}
                <div className="absolute w-[28rem] h-[28rem] md:w-[36rem] md:h-[36rem] rounded-full bg-[#FFD166]/20 animate-pulse-slow" />

                <div className="relative bg-[#FFD166] px-10 md:px-20 py-8 md:py-14 rounded-2xl border-[6px] border-white shadow-[0_8px_0_rgba(0,0,0,0.25)] flex items-center justify-center animate-bounce-very-slow">
                  {/* Bigger icons */}
                  <Plus className="w-12 h-12 md:w-24 md:h-24 text-white absolute top-3 md:top-5 left-2 md:left-4 animate-pulse" />
                  <Gem className="w-10 h-10 md:w-20 md:h-20 text-white absolute top-5 md:top-7 right-6 md:right-8 animate-spin-slow" />

                  {/* Bigger points text */}
                  <div className="relative z-10 text-white font-badtyp text-7xl md:text-[10rem] leading-none tracking-wider">
                    {bonusPoints}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER (admin controls, hidden on display) */}
      {!hideControls && (
        <div
          className="relative w-full py-3 md:py-6 px-6 md:px-12 z-20 flex justify-center items-center gap-4 md:gap-8"
          style={{ flex: "0 0 auto" }}
        >
          <button
            onClick={handleBackClick}
            data-action="reset"
            className={`bg-[#229954] p-3 md:p-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all ${
              showBonus ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 19L3 12M3 12L10 5M3 12H21"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {!showBonus && (
            <>
              <button
                onClick={handleBonusClick}
                data-action="bonus"
                className="bg-[#FFD166] text-white font-badtyp text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all group"
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span>BONUS</span>
                </div>
                <span className="block text-xs md:text-sm mt-1 opacity-70 group-hover:opacity-100">
                  Afficher les points
                </span>
              </button>
              <button
                onClick={handleOkClick}
                data-action="win"
                className="bg-[#E76F51] text-white font-badtyp text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all group"
              >
                GAGNER
                <span className="block text-xs md:text-sm mt-1 opacity-70 group-hover:opacity-100">
                  Voir l'écran de victoire
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GameInProgress;
