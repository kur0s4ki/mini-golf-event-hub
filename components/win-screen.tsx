"use client"

import React, { useEffect, useState } from "react"
import { Trophy } from "lucide-react"

interface WinScreenProps {
    points: number
    className?: string
}

const WinScreen: React.FC<WinScreenProps> = ({ points, className }) => {
    const [displayPoints, setDisplayPoints] = useState<number>(0)

    // Animate the points counter
    useEffect(() => {
        if (points === 0 || displayPoints >= points) return

        // Calculate increment step to complete in about 2 seconds
        const step = Math.max(1, Math.ceil(points / 50))
        const interval = setInterval(() => {
            setDisplayPoints((prev) => {
                const next = prev + step
                if (next >= points) {
                    clearInterval(interval)
                    return points
                }
                return next
            })
        }, 40)

        return () => clearInterval(interval)
    }, [points])

    return (
        <div className={`flex flex-col items-center justify-center h-full w-full p-8 ${className}`}>
            <div className="glass-panel rounded-3xl p-10 max-w-md w-full animate-scale-in">
                <div className="flex flex-col items-center space-y-8">
                    {/* Trophy Icon with Animation */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg transform scale-150 animate-pulse-slow"></div>
                        <div className="relative bg-primary/10 p-6 rounded-full animate-scale-in">
                            <Trophy size={64} className="text-primary animate-wiggle" />
                        </div>
                    </div>

                    {/* Win Message */}
                    <div className="text-center space-y-3">
                        <div className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium inline-block animate-fade-in">
                            Game Complete
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight animate-slide-in">
                            You Win!
                        </h1>
                    </div>

                    {/* Points Display */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            Points Earned
                        </div>
                        <div className="text-4xl font-bold tabular-nums animate-scale-in" style={{ animationDelay: "0.2s" }}>
                            {displayPoints}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex gap-2 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary/50 animate-pulse-slow"
                                style={{ animationDelay: `${i * 0.3}s` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WinScreen