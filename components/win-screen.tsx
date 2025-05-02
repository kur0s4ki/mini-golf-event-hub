"use client"

import React, { useState, useEffect } from "react"
import { Trophy, Home, Star, ArrowRight } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface WinScreenProps {
    className?: string
    points: number
    playerName?: string
    teamName?: string
}

const WinScreen: React.FC<WinScreenProps> = ({
    className,
    points,
    playerName = "Player",
    teamName = "Team"
}) => {
    const [showTrophy, setShowTrophy] = useState(false)

    // Simple array for static confetti
    const confettiCount = 200;
    const colors = ['#E76F51', '#26A69A', '#F4A261', '#FFD166', '#FFFFFF'];

    useEffect(() => {
        // Add a slight delay before showing the trophy
        const timer = setTimeout(() => {
            setShowTrophy(true)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const handlePlayAgain = () => {
        gameEvents.emit("reset", null)
    }

    // Generate static confetti array
    const staticConfetti = Array.from({ length: confettiCount }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`,
        size: `${5 + Math.random() * 10}px`,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: `${Math.random() * 360}deg`,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
    }));

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-center p-0 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#229954] via-[#6B43A9] to-[#FFD166]" />

                {/* Direct confetti implementation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {staticConfetti.map((piece) => (
                        <div
                            key={piece.id}
                            className="confetti-piece"
                            style={{
                                left: piece.left,
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                animationDelay: piece.delay,
                                animationDuration: piece.duration,
                                transform: `rotate(${piece.rotation})`,
                                borderRadius: piece.shape === 'circle' ? '50%' : '0',
                            }}
                        />
                    ))}
                </div>

                {/* Top navigation bar */}
                <div className="relative w-full py-5 px-8 z-20 flex justify-between items-center">
                    {/* MINI Golf logo in top right */}
                    <div className="absolute right-8 top-6">
                        <div className="font-badtyp text-4xl text-[#229954]">
                            <span className="text-[#FFD166]">MINI</span> <span className="text-white">Golf</span>
                        </div>
                    </div>
                </div>

                {/* Main content - win celebration */}
                <div className="relative flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col items-center justify-center p-8">
                    <div className="w-full rounded-3xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center relative overflow-hidden">
                        {/* Background image */}
                        <div
                            className="absolute inset-0 w-full h-full bg-black/70 bg-cover bg-center"
                            style={{ backgroundImage: "url('/images/bg.png')" }}
                        />

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Win message */}
                            <h1 className="text-white font-badtyp text-7xl mb-4 animate-bounce-slow">
                                CHAMPION !
                            </h1>

                            {/* Infos du joueur */}
                            <h2 className="text-[#FFD166] font-badtyp text-3xl mb-8">
                                {playerName} • {teamName}
                            </h2>

                            {/* Trophy animation */}
                            <div className={`mb-8 transition-all duration-700 ${showTrophy ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                <div className="relative z-20">
                                    {/* Stars around trophy */}
                                    <div className="absolute -top-6 -left-6 animate-pulse-slow z-20">
                                        <Star className="w-12 h-12 text-[#FFD166]" />
                                    </div>
                                    <div className="absolute -top-4 -right-6 animate-pulse-slow z-20" style={{ animationDelay: '0.3s' }}>
                                        <Star className="w-10 h-10 text-[#E76F51]" />
                                    </div>
                                    <div className="absolute -bottom-6 -left-4 animate-pulse-slow z-20" style={{ animationDelay: '0.6s' }}>
                                        <Star className="w-8 h-8 text-[#26A69A]" />
                                    </div>

                                    {/* Trophy */}
                                    <div className="p-8 bg-[#FFD166]/20 rounded-full border-4 border-white">
                                        <Trophy className="w-32 h-32 text-[#FFD166] animate-zoom" />
                                    </div>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="bg-[#229954] px-12 py-6 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] mb-10 flex items-center">
                                <div className="text-center">
                                    <div className="text-white font-badtyp text-2xl mb-1">SCORE</div>
                                    <div className="text-white font-badtyp text-5xl">{points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bouton rejouer */}
                {/* <div className="relative z-20 -mt-6 mb-16">
                    <button
                        onClick={handlePlayAgain}
                        className="group bg-[#229954] text-white font-badtyp text-3xl px-16 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-4"
                    >
                        REJOUER
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </button>
                </div> */}
            </div>
        </div>
    )
}

export default WinScreen 