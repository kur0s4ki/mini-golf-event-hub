"use client"

import React, { useState, useEffect } from "react"
import { Home, Globe } from "lucide-react"
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
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    // Calculate a minimal score when time's up
                    const baseScore = 100;
                    gameEvents.emit("timeUp", baseScore);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
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
        const totalScore = baseScore + timeBonus;
        
        // Emit win event with the score to trigger transition to win screen
        gameEvents.emit("win", totalScore);
    }
    
    // Handle FAIL button click to go to loss screen
    const handleFailClick = () => {
        // Calculate a lower score based on remaining time
        const timeBonus = Math.floor(timeRemaining / 5);
        const baseScore = 200;
        const totalScore = baseScore + timeBonus;
        
        // Emit loss event with the score to trigger transition to loss screen
        gameEvents.emit("loss", totalScore);
    }
    
    // Handle back button click
    const handleBackClick = () => {
        gameEvents.emit("reset", null);
    }

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-between p-0 overflow-hidden">
                {/* Background base color */}
                <div className="absolute inset-0 bg-[#6B43A9]" />
                
                {/* Background image - will be added later */}
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
                    
                    {/* MIND Golf logo */}
                    <div className="absolute right-8 top-6">
                        <div className="font-badtyp text-4xl text-[#26A69A]">
                            <span className="text-white">The</span> MIND <span className="text-white">golf</span>
                        </div>
                    </div>
                </div>
                
                {/* Main game content */}
                <div className="relative flex-1 w-full max-w-4xl mx-auto z-10 flex flex-col items-center justify-center p-8">
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
                </div>
                
                {/* Footer navigation */}
                <div className="relative w-full py-8 px-8 z-20 flex justify-between items-center">
                    <button 
                        onClick={handleBackClick}
                        className="bg-[#26A69A] p-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <div className="flex gap-4">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameInProgress 