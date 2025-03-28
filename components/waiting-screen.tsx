"use client"

import React, { useState, useEffect } from "react"
import { Globe, Flag, Trophy, Target } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface WaitingScreenProps {
    className?: string
}

interface BackgroundElement {
    top: string
    left: string
    size: string
    rotation: string
    opacity: number
    type: 'ball' | 'flag' | 'trophy' | 'target'
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ className }) => {
    const [bgElements, setBgElements] = useState<BackgroundElement[]>([]);

    useEffect(() => {
        // Generate static background elements only on the client side
        const elements = Array.from({ length: 40 }, (_, index) => {
            // Distribute elements across the screen
            const top = `${Math.random() * 100}%`
            const left = `${Math.random() * 100}%`
            
            // Randomize sizes but keep them small
            const size = `${1 + Math.random() * 1.5}rem`
            
            // Random rotation
            const rotation = `${Math.random() * 360}deg`
            
            // Random opacity but keep them subtle
            const opacity = 0.03 + Math.random() * 0.12
            
            // Select icon type
            const typeIndex = Math.floor(Math.random() * 4)
            const types = ['ball', 'flag', 'trophy', 'target'] as const
            
            return {
                top,
                left,
                size,
                rotation,
                opacity,
                type: types[typeIndex]
            }
        });
        
        setBgElements(elements);
    }, []);

    const handleStartClick = () => {
        gameEvents.emit("start", {
            displayName: "John Doe",
            team: { name: "Eagles" }
        })
    }
    
    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Main container - full width and height of viewport */}
            <div className="fixed inset-0 flex flex-col items-center justify-center p-0 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B43A9] from-10% via-[#4B2A82] via-40% to-[#371F6A] to-90%" />
                
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {bgElements.map((element, index) => (
                        <div
                            key={index}
                            className="absolute"
                            style={{
                                top: element.top,
                                left: element.left,
                                transform: `rotate(${element.rotation})`,
                                opacity: element.opacity,
                            }}
                        >
                            {element.type === 'ball' && (
                                <div className="rounded-full bg-white" style={{ width: element.size, height: element.size }}></div>
                            )}
                            {element.type === 'flag' && (
                                <Flag className="text-white" style={{ width: element.size, height: element.size }} />
                            )}
                            {element.type === 'trophy' && (
                                <Trophy className="text-white" style={{ width: element.size, height: element.size }} />
                            )}
                            {element.type === 'target' && (
                                <Target className="text-white" style={{ width: element.size, height: element.size }} />
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Top navigation bar */}
                <div className="relative w-full py-5 px-8 z-20 flex justify-between items-center">
                    {/* Timer placeholder - empty to match layout */}
                    <div></div>
                    
                    {/* MIND Golf logo */}
                    <div className="absolute right-8 top-6">
                        <div className="font-badtyp text-4xl text-[#26A69A]">
                            <span className="text-white">The</span> MIND <span className="text-white">golf</span>
                        </div>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col items-center justify-center p-8">
                    <div className="w-full rounded-3xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center relative overflow-hidden">
                        {/* Background image for the card */}
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: "url('/images/bg.png')" }}
                        />
                        
                        {/* Content with relative positioning to sit above background */}
                        <div className="relative z-10 mb-16 flex items-center justify-center w-full">
                            <div className="animate-zoom">
                                <img
                                    src="/images/logo.png"
                                    alt="The MIND golf"
                                    className="w-[500px] h-auto object-contain"
                                    style={{ filter: 'drop-shadow(0px 4px 8px rgba(216, 114, 77, 0.2))' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Touch to begin button - positioned to be half in and half out of the purple box */}
                <div className="relative z-20 -mt-12 mb-16">
                    <button
                        onClick={handleStartClick}
                        className="bg-[#26A69A] text-white font-badtyp text-3xl px-16 py-5 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all"
                    >
                        BADGE TO BEGIN
                    </button>
                </div>

                {/* Footer navigation */}
                <div className="relative w-full py-8 px-8 z-20 flex justify-between items-center">
                    {/* Language selector */}
                    <button className="bg-[#26A69A] p-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-2">
                        <Globe className="w-6 h-6 text-white" />
                        <span className="text-white font-badtyp text-xl">EN</span>
                    </button>
                    
                    {/* Help button */}
                    <button className="bg-[#26A69A] p-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all">
                        <span className="text-white font-badtyp text-2xl">?</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WaitingScreen