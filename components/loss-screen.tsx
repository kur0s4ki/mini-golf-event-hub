"use client"

import React, { useState, useEffect } from "react"
import { Home, RefreshCcw, ArrowRight, CloudRain, Frown } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface LossScreenProps {
    className?: string
    points: number
    playerName?: string
    teamName?: string
}

const LossScreen: React.FC<LossScreenProps> = ({
    className,
    points,
    playerName = "Player",
    teamName = "Aigles"
}) => {
    const [showMessage, setShowMessage] = useState(false)

    // Rain drops array
    const rainCount = 150;

    useEffect(() => {
        // Add a slight delay before showing the message
        const timer = setTimeout(() => {
            setShowMessage(true)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const handlePlayAgain = () => {
        gameEvents.emit("reset", null)
    }

    // Generate rain drops array
    const raindrops = Array.from({ length: rainCount }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${0.5 + Math.random() * 1}s`,
        size: `${1 + Math.random() * 3}px`,
        height: `${15 + Math.random() * 30}px`
    }));

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-center p-0 overflow-hidden">
                {/* Background gradient - darker for loss */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] from-10% via-[#1E293B] via-40% to-[#0F172A] to-90%" />

                {/* Rain animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {raindrops.map((drop) => (
                        <div
                            key={drop.id}
                            className="raindrop"
                            style={{
                                left: drop.left,
                                width: drop.size,
                                height: drop.height,
                                animationDelay: drop.delay,
                                animationDuration: drop.duration,
                            }}
                        />
                    ))}
                </div>

                {/* Top navigation bar */}
                <div className="relative w-full py-5 px-8 z-20 flex justify-between items-center">
                    {/* Home button */}
                    <button
                        onClick={handlePlayAgain}
                        className="bg-[#475569] p-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all"
                    >
                        <Home className="w-8 h-8 text-white" />
                    </button>

                    {/* MIND Golf logo */}
                    <div className="absolute right-8 top-6">
                        <div className="font-badtyp text-4xl text-[#64748B]">
                            <span className="text-white">The</span> MIND <span className="text-white">golf</span>
                        </div>
                    </div>
                </div>

                {/* Main content - loss message */}
                <div className="relative flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col items-center justify-center p-8">
                    <div className="w-full rounded-3xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center relative overflow-hidden">
                        {/* Background pattern - rain overlay */}
                        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
                            style={{ backgroundImage: "url('/images/bg.png')" }} />

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Loss message */}
                            <h1 className="text-white font-badtyp text-7xl mb-4 animate-bounce-slow">
                                NICE TRY!
                            </h1>

                            {/* Player info */}
                            <h2 className="text-[#94A3B8] font-badtyp text-3xl mb-8">
                                {playerName} • {teamName}
                            </h2>

                            {/* Loss animation */}
                            <div className={`mb-8 transition-all duration-700 ${showMessage ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                <div className="relative z-20">
                                    {/* Animated rain cloud and frown */}
                                    <div className="relative flex flex-col items-center">
                                        <div className="mb-2 animate-pulse-slow">
                                            <CloudRain className="w-32 h-32 text-[#94A3B8]" />
                                        </div>
                                        <div className="mt-3 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
                                            <Frown className="w-20 h-20 text-[#94A3B8]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="bg-[#475569] px-12 py-6 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] mb-10 flex items-center">
                                <div className="text-center">
                                    <div className="text-white font-badtyp text-2xl mb-1">SCORE</div>
                                    <div className="text-white font-badtyp text-5xl">{points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Play again button */}
                <div className="relative z-20 -mt-6 mb-16">
                    <button
                        onClick={handlePlayAgain}
                        className="group bg-[#475569] text-white font-badtyp text-3xl px-16 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-4"
                    >
                        TRY AGAIN
                        <RefreshCcw className="w-6 h-6 transition-transform group-hover:rotate-45" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LossScreen