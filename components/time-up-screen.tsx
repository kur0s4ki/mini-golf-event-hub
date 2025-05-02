"use client"

import React, { useState, useEffect } from "react"
import { Clock, Home, AlertCircle, Timer } from "lucide-react"
import { gameEvents } from "@/lib/eventEmitter"

interface TimeUpScreenProps {
    className?: string
    points: number
    playerName?: string
    teamName?: string
}

const TimeUpScreen: React.FC<TimeUpScreenProps> = ({
    className,
    points,
    playerName = "Joueur",
    teamName = "Aigles"
}) => {
    const [countdown, setCountdown] = useState(10)
    const [clockRotation, setClockRotation] = useState(0)

    // Générer des particules de sable pour l'effet sablier
    const sandParticles = Array.from({ length: 120 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${-10 - Math.random() * 20}%`, // Start above the viewport
        size: `${2 + Math.random() * 4}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 3}s`,
        color: Math.random() > 0.7 ? '#FFD166' : '#E6C96B'
    }))

    // Animation de rotation des aiguilles de l'horloge
    useEffect(() => {
        const rotationInterval = setInterval(() => {
            setClockRotation(prev => (prev + 30) % 360)
        }, 300)

        return () => clearInterval(rotationInterval)
    }, [])

    // Compte à rebours pour la redirection automatique
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    gameEvents.emit("reset", null)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Générer les marques de l'horloge
    const clockTicks = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        rotation: index * 30,
        length: index % 3 === 0 ? '20px' : '10px',
        width: index % 3 === 0 ? '4px' : '2px'
    }))

    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            {/* Conteneur principal - pleine largeur et hauteur de la fenêtre */}
            <div className="fixed inset-0 flex flex-col items-center justify-center p-0 overflow-hidden">
                {/* Dégradé de fond - bleu pour l'écran temps écoulé */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] from-10% via-[#334155] via-40% to-[#475569] to-90%" />

                {/* Animation de particules de sable - chute depuis le haut */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {sandParticles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute sand-particle"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.color,
                                animationDelay: particle.delay,
                                animationDuration: particle.duration,
                                opacity: 0.7 + Math.random() * 0.3
                            }}
                        />
                    ))}
                </div>

                {/* Particules de l'horloge */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {clockTicks.map((tick) => (
                            <div
                                key={tick.id}
                                className="absolute bg-white/40 rounded-full animate-pulse-slow"
                                style={{
                                    height: tick.length,
                                    width: tick.width,
                                    transform: `rotate(${tick.rotation}deg) translateY(-120px)`,
                                    transformOrigin: 'center bottom',
                                    animationDelay: `${tick.id * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Barre de navigation supérieure */}
                <div className="relative w-full py-5 px-8 z-20 flex justify-between items-center">
                    {/* Logo MINI Golf */}
                    <div className="font-badtyp text-4xl text-[#FFD166]">
                        <span className="text-white">MINI</span> <span className="text-[#FFD166]">Golf</span>
                    </div>
                </div>

                {/* Contenu principal - message temps écoulé */}
                <div className="relative flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col items-center justify-center p-8">
                    <div className="w-full rounded-3xl border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center relative overflow-hidden">
                        {/* Modèle de fond - motif horloge */}
                        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
                            style={{ backgroundImage: "url('/images/bg.png')" }} />

                        {/* Contenu */}
                        <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Message temps écoulé */}
                            <h1 className="text-white font-badtyp text-7xl mb-4">
                                TEMPS ÉCOULÉ!
                            </h1>

                            {/* Informations joueur */}
                            <h2 className="text-[#94A3B8] font-badtyp text-3xl mb-8">
                                {playerName} • {teamName}
                            </h2>

                            {/* Animation de l'horloge */}
                            <div className="mb-8 transition-all duration-700">
                                <div className="relative z-20">
                                    {/* Horloge animée */}
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-48 h-48 rounded-full border-8 border-white bg-[#1E293B]/40 flex items-center justify-center relative">
                                            {/* Aiguille des heures */}
                                            <div
                                                className="absolute w-1.5 h-16 bg-[#94A3B8] rounded-full"
                                                style={{
                                                    transformOrigin: 'center bottom',
                                                    bottom: '50%',
                                                    left: 'calc(50% - 0.75px)',
                                                    transform: `rotate(${clockRotation * 0.5}deg)`
                                                }}
                                            />

                                            {/* Aiguille des minutes */}
                                            <div
                                                className="absolute w-1 h-24 bg-white rounded-full"
                                                style={{
                                                    transformOrigin: 'center bottom',
                                                    bottom: '50%',
                                                    left: 'calc(50% - 0.5px)',
                                                    transform: `rotate(${clockRotation}deg)`
                                                }}
                                            />

                                            {/* Aiguille des secondes avec animation indépendante */}
                                            <div
                                                className="absolute w-0.5 h-22 bg-[#E76F51] rounded-full animate-spin-slow"
                                                style={{
                                                    transformOrigin: 'center bottom',
                                                    bottom: '50%',
                                                    left: '50%',
                                                    height: '23px'
                                                }}
                                            />

                                            {/* Point central */}
                                            <div className="absolute w-4 h-4 bg-[#E76F51] rounded-full z-10" />

                                            {/* Chiffres de l'horloge */}
                                            <div className="absolute top-4 font-badtyp text-lg text-white">12</div>
                                            <div className="absolute right-4 font-badtyp text-lg text-white">3</div>
                                            <div className="absolute bottom-4 font-badtyp text-lg text-white">6</div>
                                            <div className="absolute left-4 font-badtyp text-lg text-white">9</div>
                                        </div>

                                        <div className="mt-6 flex flex-col items-center">
                                            <div className="flex gap-3 items-center">
                                                <AlertCircle className="w-8 h-8 text-[#E76F51]" />
                                                <span className="text-white font-badtyp text-xl animate-pulse-slow">TEMPS ÉCOULÉ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="bg-[#475569] px-12 py-6 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] mb-10 flex items-center">
                                <div className="text-center">
                                    <div className="text-white font-badtyp text-2xl mb-1">SCORE FINAL</div>
                                    <div className="text-white font-badtyp text-5xl">{points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compte à rebours de redirection automatique - plus visible */}
                <div className="relative z-20 -mt-6 mb-16">
                    <div className="flex flex-col items-center">
                        <div className={`
                            px-8 py-6 rounded-xl border-4 border-white
                            shadow-[0_6px_0_rgba(0,0,0,0.2)] mb-4
                            bg-[#E76F51]
                        `}>
                            <div className="flex items-center gap-4">
                                <Timer className="w-8 h-8 text-white animate-pulse" />
                                <span className={`
                                    font-badtyp text-4xl text-white
                                    ${countdown <= 5 ? 'animate-flash' : ''}
                                `}>
                                    {countdown}
                                </span>
                            </div>
                        </div>
                        <div className="text-white font-badtyp text-xl opacity-80">
                            Retour au salon...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeUpScreen