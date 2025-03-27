"use client"

import React, { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface GameScreenProps {
    timerSeconds: number
    playerName: string
    teamName: string
    className?: string
}

const GameScreen: React.FC<GameScreenProps> = ({
    timerSeconds,
    playerName,
    teamName,
    className,
}) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(timerSeconds)
    const [isPaused, setIsPaused] = useState<boolean>(false)

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Calculate progress percentage for the timer
    const timerProgress = (timeRemaining / timerSeconds) * 100

    // Setup the countdown timer effect
    useEffect(() => {
        if (timeRemaining <= 0 || isPaused) return

        const interval = setInterval(() => {
            setTimeRemaining((prev) => Math.max(0, prev - 1))
        }, 1000)

        return () => clearInterval(interval)
    }, [timeRemaining, isPaused])

    return (
        <div className={`flex flex-col items-center justify-center h-full w-full p-8 ${className}`}>
            <div className="glass-panel rounded-3xl p-8 max-w-lg w-full animate-scale-in">
                <div className="flex flex-col space-y-8">
                    {/* Player Info Section */}
                    <div className="flex flex-col space-y-3 items-center">
                        <div className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium animate-fade-in">
                            Game in Progress
                        </div>
                        <h2 className="text-2xl font-medium tracking-tight animate-slide-in">{playerName}</h2>
                        <div className="text-sm text-muted-foreground animate-slide-in" style={{ animationDelay: "0.1s" }}>
                            Team {teamName}
                        </div>
                    </div>

                    {/* Timer Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            {/* Timer Background */}
                            <div className="absolute inset-0 rounded-full bg-muted"></div>

                            {/* Timer Progress */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="68"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray="427"
                                    strokeDashoffset={427 - (427 * timerProgress) / 100}
                                    className="text-primary transition-all duration-1000 ease-linear"
                                />
                            </svg>

                            {/* Timer Center */}
                            <div className="z-10 flex flex-col items-center justify-center">
                                <Clock size={24} className="text-primary mb-1" />
                                <div className="text-2xl font-bold tabular-nums">
                                    {formatTime(timeRemaining)}
                                </div>
                            </div>
                        </div>

                        {/* Animation Elements */}
                        <div className="w-full max-w-xs mt-4 flex justify-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-1.5 bg-primary/30 rounded-full animate-pulse-slow"
                                    style={{
                                        width: `${10 + Math.random() * 15}%`,
                                        animationDelay: `${i * 0.2}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Instruction */}
                    <div className="text-center text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        Complete the course as fast as you can
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameScreen