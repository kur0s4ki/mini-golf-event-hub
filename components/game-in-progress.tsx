"use client"

import React, { useState, useEffect } from "react"
import { Home, Globe, Gift, Star, Plus, Gem } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface GameInProgressProps {
    className?: string
    initialTime?: number
}

const GameInProgress: React.FC<GameInProgressProps> = ({ 
    className, 
    initialTime = 20 // 20 seconds
}) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime)
    const [showBonus, setShowBonus] = useState(false)
    const [totalScore, setTotalScore] = useState(0)
    const [bonusScale, setBonusScale] = useState(0)
    const [bonusCountdown, setBonusCountdown] = useState(5)
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
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
            setBonusCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // First fade out the animation
                    setBonusScale(0);
                    // Then hide the bonus overlay and add the points
                    setTimeout(() => {
                        setShowBonus(false);
                        setTotalScore(prev => prev + 500);
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
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    
    // Determine if time is running low (10 seconds or less)
    const isTimeLow = timeRemaining <= 10
    
    // Determine if time is critically low (5 seconds or less)
    const isCritical = timeRemaining <= 5
    
    // Handle OK button click to go to win screen
    const handleOkClick = () => {
        // Calculate a score based on remaining time
        const timeBonus = Math.floor(timeRemaining / 3);
        const baseScore = 500;
        const finalScore = baseScore + timeBonus + totalScore;
        
        // Emit win event with the score to trigger transition to win screen
        gameEvents.emit("win", finalScore);
    }
    
    // Handle FAIL button click to go to loss screen
    const handleFailClick = () => {
        // Calculate a lower score based on remaining time
        const timeBonus = Math.floor(timeRemaining / 5);
        const baseScore = 200;
        const finalScore = baseScore + timeBonus + totalScore;
        
        // Emit loss event with the score to trigger transition to loss screen
        gameEvents.emit("loss", finalScore);
    }
    
    // Handle BONUS button click
    const handleBonusClick = () => {
        setShowBonus(true);
    }
    
    // Handle back button click
    const handleBackClick = () => {
        gameEvents.emit("reset", null);
    }
    
    // Generate sparkle elements for the bonus effect
    const sparkles = Array.from({ length: 50 }, (_, index) => ({
        id: index,
        top: `${Math.random() * 200 - 50}%`,
        left: `${Math.random() * 200 - 50}%`,
        size: `${3 + Math.random() * 10}px`,
        color: Math.random() > 0.5 ? '#FFD166' : '#26A69A',
        animationDuration: `${0.5 + Math.random()}s`,
        animationDelay: `${Math.random() * 5}s`
    }));

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-between p-0 overflow-hidden">
                {/* Background base color */}
                <div className="absolute inset-0 bg-[#6B43A9]" />
                
                {/* Background image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('/images/bg2.png')" }}
                />
                
                {/* Top navigation bar */}
                <div className="relative w-full py-5 px-8 z-20 flex justify-between items-center">
                    {/* Timer - with 3D effect */}
                    <div 
                        className={`
                            min-w-[380px] min-h-[120px] 
                            rounded-xl border-4 border-white 
                            shadow-[0_6px_0_rgba(0,0,0,0.2)] 
                            flex items-center justify-center 
                            transition-all duration-300
                            ${isCritical ? 'bg-red-600' : isTimeLow ? 'bg-[#E76F51]' : 'bg-[#26A69A]'} 
                            ${isCritical ? 'animate-shake' : isTimeLow ? 'animate-heartbeat' : ''}
                        `}
                    >
                        <span 
                            className={`
                                font-badtyp text-6xl text-white tracking-wide
                                ${isCritical ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-flash' : ''}
                            `}
                        >
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                    
                    {/* Score display */}
                    <div className="absolute right-8 top-6 flex flex-col items-end">
                        <div className="font-badtyp text-4xl text-[#26A69A]">
                            <span className="text-white">The</span> MIND <span className="text-white">golf</span>
                        </div>
                    </div>
                </div>
                
                {/* Main game content */}
                <div className="relative flex-1 w-full max-w-4xl mx-auto z-10 flex flex-col items-center justify-center p-8">
                    {!showBonus && (
                        <div className="w-full bg-[#6B43A9] rounded-3xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center">
                            <h1 className="text-[#26A69A] font-badtyp text-5xl mb-3">STRIKE CLOWN</h1>
                            <p className="text-white font-badtyp text-2xl mb-5">LET'S PLAY WITH THE STRIKE CLOWN!</p>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[#E76F51] uppercase font-badtyp text-xl">Difficulty</span>
                                <div className="flex gap-2">
                                    <span className="text-[#E76F51] text-3xl">▲</span>
                                    <span className="text-[#E76F51] text-3xl">▲</span>
                                    <span className="text-[#E76F51] text-3xl">▲</span>
                                    <span className="text-[#E76F51]/30 text-3xl">▲</span>
                                </div>
                            </div>
                            
                            <p className="text-white/80 italic text-center max-w-md mb-8 font-badtyp text-xl">
                                To be champion you have to golf balls passing the clown's tongue!
                            </p>
                            
                            <button className="bg-[#26A69A] text-white font-badtyp text-2xl px-10 py-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all">
                                COURSE AVAILABLE
                            </button>
                        </div>
                    )}

                    {/* Bonus animation overlay */}
                    {showBonus && (
                        <div className="w-full h-full flex items-center justify-center relative">
                            {/* Sparkle animations */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                                            borderRadius: '50%',
                                            opacity: 0,
                                            transform: 'scale(0)',
                                            animationDelay: sparkle.animationDelay,
                                            animationDuration: sparkle.animationDuration
                                        }}
                                    />
                                ))}
                            </div>
                            
                            {/* Bonus message */}
                            <div 
                                className="flex flex-col items-center justify-center transition-all duration-700"
                                style={{ transform: `scale(${bonusScale})` }}
                            >
                                <div className="text-white font-badtyp text-2xl mb-2 animate-bounce-slow">
                                    BONUS!
                                </div>
                                
                                <div className="relative flex items-center justify-center">
                                    {/* Background glow */}
                                    <div className="absolute w-80 h-80 rounded-full bg-[#FFD166]/20 animate-pulse-slow" />
                                    
                                    <div className="relative bg-[#FFD166] px-12 py-8 rounded-xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] flex items-center justify-center animate-bounce-very-slow">
                                        <Plus className="w-16 h-16 text-white absolute top-3 left-[1px] animate-pulse" />
                                        <Gem className="w-12 h-12 text-white absolute top-5 right-4 animate-spin-slow" />
                                        <div className="relative z-10 text-white font-badtyp text-8xl tracking-wider">
                                            500
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 bg-[#E76F51] px-6 py-3 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-white animate-pulse-slow" />
                                        <span className="text-white font-badtyp text-2xl">POINTS ADDED</span>
                                        <Star className="w-6 h-6 text-white animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer navigation */}
                <div className="relative w-full py-8 px-8 z-20 flex justify-between items-center">
                    <button 
                        onClick={handleBackClick}
                        className={`bg-[#26A69A] p-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all ${showBonus ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <div className="flex gap-4">
                        {!showBonus && (
                            <>
                                <button 
                                    onClick={handleBonusClick}
                                    className="bg-[#FFD166] text-white font-badtyp text-3xl px-12 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Gift className="w-8 h-8 text-white" />
                                        <span>BONUS</span>
                                    </div>
                                    <span className="block text-sm mt-1 opacity-70 group-hover:opacity-100">+500 Points</span>
                                </button>
                                <button 
                                    onClick={handleFailClick}
                                    className="bg-[#64748B] text-white font-badtyp text-3xl px-16 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all group"
                                >
                                    FAIL
                                    <span className="block text-sm mt-1 opacity-70 group-hover:opacity-100">Show Loss Screen</span>
                                </button>
                                <button 
                                    onClick={handleOkClick}
                                    className="bg-[#E76F51] text-white font-badtyp text-3xl px-16 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all group"
                                >
                                    WIN
                                    <span className="block text-sm mt-1 opacity-70 group-hover:opacity-100">Show Win Screen</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameInProgress 