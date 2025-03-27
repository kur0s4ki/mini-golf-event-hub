"use client"

import React from "react"
import { Globe } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface WaitingScreenProps {
    className?: string
}

interface StickPosition {
    top: string
    left: string
    rotation: string
    floatX: string
    floatY: string
    scale: number
    initialOpacity: number
    delay: number
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ className }) => {
    const handleStartClick = () => {
        gameEvents.emit("start", {
            displayName: "John Doe",
            team: { name: "Eagles" }
        })
    }

    // Generate random stick positions with animation variables
    const stickPositions: StickPosition[] = Array.from({ length: 80 }, (_, index) => {
        // Create a more natural scattered distribution
        const section = Math.floor(index / 20) // Divide into 4 main sections
        const sectionSpread = 25 // Each section is 25% of the screen

        // Base position within section plus random offset
        const baseTop = section * sectionSpread
        const randomTop = baseTop + Math.random() * sectionSpread
        const randomLeft = Math.random() * 100

        // Adjust scale based on position (smaller near edges)
        const distanceFromCenter = Math.abs(50 - randomLeft) / 50
        const baseScale = 0.15 - (distanceFromCenter * 0.05)

        return {
            top: `${randomTop}%`,
            left: `${randomLeft}%`,
            rotation: `${Math.random() * 360}deg`,
            floatX: `${-12 + Math.random() * 24}px`,
            floatY: `${-12 + Math.random() * 24}px`,
            scale: baseScale + Math.random() * 0.2,
            initialOpacity: 0.05 + Math.random() * 0.07,
            delay: Math.random() * 5,
        }
    })

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container with gradient teal background - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-center p-8 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ecfbd] from-5% via-[#2A9D8F] via-40% to-[#1a5c55] to-90%" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_100%)]" />

                {/* Scattered sticks container with better performance */}
                <div className="absolute inset-0 overflow-hidden">
                    {stickPositions.map((pos, index) => (
                        <div
                            key={index}
                            className="absolute w-16 h-16 pointer-events-none stick"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                transform: `scale(${pos.scale})`,
                                ['--rotation' as string]: pos.rotation,
                                ['--float-x' as string]: pos.floatX,
                                ['--float-y' as string]: pos.floatY,
                                ['--initial-opacity' as string]: pos.initialOpacity.toString(),
                                animationDelay: `${pos.delay}s`,
                            } as React.CSSProperties}
                        >
                            <img
                                src="/images/sticks.png"
                                alt=""
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* Center content with purple background image and orange border */}
                <div className="relative max-w-5xl w-full min-h-[600px] rounded-xl border-4 border-[#F4A261] p-6 flex flex-col items-center justify-center overflow-hidden backdrop-blur-sm bg-white/5">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50"
                        style={{ backgroundImage: "url('/images/bg.png')" }}
                    />

                    {/* Logo and title */}
                    <div className="relative z-10 mb-16 flex items-center justify-center w-full">
                        <div className="animate-float">
                            <img
                                src="/images/logo.png"
                                alt="The MIND golf"
                                className="w-[500px] h-auto object-contain drop-shadow-lg"
                                style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Touch to begin button - positioned to be half in and half out of the purple box */}
                <div className="relative z-20 -mt-12">
                    <button
                        onClick={handleStartClick}
                        className="group relative px-16 py-6 text-2xl font-bold text-[#F4A261] bg-[#2A9D8F] rounded-full border-4 border-[#F4A261] shadow-[0_8px_0_rgb(244,162,97,0.5)] transform transition-all duration-150 hover:shadow-[0_4px_0_rgb(244,162,97,0.5)] hover:translate-y-1 active:shadow-none active:translate-y-2"
                    >
                        <span className="inline-block font-badtyp text-4xl tracking-[0.15em] leading-none">
                            TOUCH TO BEGIN
                        </span>
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10" />
                    </button>
                </div>

                {/* Footer with language selector */}
                <div className="absolute bottom-8 left-8">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-[#F4A261] transition-all hover:bg-white/30">
                        <Globe size={24} className="text-[#F4A261]" />
                        <span className="text-white font-medium">EN</span>
                    </div>
                </div>

                {/* Help button */}
                <div className="absolute bottom-8 right-8">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border-2 border-[#F4A261] transition-all hover:bg-white/30">
                        <span className="text-[#F4A261] font-bold text-xl">?</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaitingScreen