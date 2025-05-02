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
    const [showLangPopup, setShowLangPopup] = useState(false);
    const [selectedLang, setSelectedLang] = useState('FR');

    useEffect(() => {
        // Générer des éléments de fond statiques uniquement sur le côté client
        const elements = Array.from({ length: 40 }, (_, index) => {
            // Distribuer les éléments sur l'écran
            const top = `${Math.random() * 100}%`
            const left = `${Math.random() * 100}%`

            // Tailles aléatoires mais petites
            const size = `${1 + Math.random() * 1.5}rem`

            // Rotation aléatoire
            const rotation = `${Math.random() * 360}deg`

            // Opacité aléatoire mais discrète
            const opacity = 0.03 + Math.random() * 0.12

            // Sélectionner le type d'icône
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
            displayName: "Jean Doe",
            team: { name: "Aigles" }
        })
    }

    return (
        <div className="min-h-screen w-full bg-black flex flex-col">
            {/* BARRE DE NAVIGATION */}
            <div className="w-full flex items-center justify-between px-12 py-5 md:py-5 bg-gradient-to-r from-[#229954] via-[#6B43A9] to-[#FFD166] shadow-lg z-30">
                <div className="font-badtyp text-3xl md:text-4xl text-white flex items-center gap-3">
                    <Flag className="w-7 h-7 md:w-8 md:h-8 text-[#FFD166]" /> MINI <span className="text-[#FFD166]">Golf</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-badtyp text-4xl md:text-5xl tracking-wide text-white flex">
                        {'EN ATTENTE'.split('').map((letter, index) => (
                            <span
                                key={index}
                                className={`inline-block ${letter !== ' ' ? 'animate-letter-bounce' : ''}`}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    marginRight: letter === ' ' ? '0.5rem' : '0.05rem'
                                }}
                            >
                                {letter === ' ' ? '\u00A0' : letter}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-badtyp text-3xl md:text-4xl text-white">Prêt</span>
                    <span className="font-badtyp text-4xl md:text-5xl text-[#FFD166]">✓</span>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Icônes de fond (discrètes) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {bgElements.map((element, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                top: element.top,
                                left: element.left,
                                width: element.size,
                                height: element.size,
                                opacity: element.opacity,
                                transform: `rotate(${element.rotation})`,
                            }}
                        >
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

                {/* CARTE D'INFORMATION PRINCIPALE - compactée */}
                <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8 bg-black/70 rounded-2xl border-4 border-[#FFD166] shadow-2xl px-12 py-16 mt-12 mb-12 scale-110">
                    <img src="/images/logo.png" alt="Mini Golf" className="w-[200px] h-auto object-contain mb-2" style={{ filter: 'drop-shadow(0px 4px 8px rgba(216, 114, 77, 0.2))' }} />
                    <span className="text-white font-badtyp text-2xl md:text-3xl text-center">En attente de joueurs...</span>
                    <span className="text-[#FFD166] font-badtyp text-lg md:text-xl text-center mt-2">Placez votre balle sur la zone violette pour démarrer la partie !</span>
                    <button
                        onClick={handleStartClick}
                        className="mt-6 bg-[#229954] text-white font-badtyp text-xl md:text-2xl px-8 py-4 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all"
                    >
                        Démarrer la partie
                    </button>
                </div>
            </div>

            {/* PIED DE PAGE */}
            <div className="relative w-full py-4 px-8 z-20 flex justify-center items-center gap-6">
                {/* Sélecteur de langue */}
                <button className="bg-[#229954] p-3 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-2" onClick={() => setShowLangPopup(true)}>
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <span className="text-white font-badtyp text-base md:text-xl">{selectedLang}</span>
                </button>
                {showLangPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLangPopup(false)}>
                        <div className="bg-white rounded-3xl border-4 border-[#229954] shadow-lg p-8 flex flex-col items-center min-w-[240px] md:min-w-[300px]" onClick={e => e.stopPropagation()}>
                            <span className="font-badtyp text-2xl md:text-3xl mb-6 text-[#229954]">Choisir la langue</span>
                            <button
                                className="w-full mb-3 bg-[#229954] text-white font-badtyp text-lg md:text-2xl px-6 md:px-8 py-2 md:py-3 rounded-xl border-4 border-white shadow-md hover:bg-[#1b7a3a] transition-all flex items-center gap-3 justify-center"
                                onClick={() => { setSelectedLang('EN'); setShowLangPopup(false); }}
                            >
                                <img src="/images/flags/en.png" alt="Drapeau anglais" className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover" />
                                Anglais
                            </button>
                            <button
                                className="w-full mb-3 bg-[#229954] text-white font-badtyp text-lg md:text-2xl px-6 md:px-8 py-2 md:py-3 rounded-xl border-4 border-white shadow-md hover:bg-[#1b7a3a] transition-all flex items-center gap-3 justify-center"
                                onClick={() => { setSelectedLang('FR'); setShowLangPopup(false); }}
                            >
                                <img src="/images/flags/fr.png" alt="Drapeau français" className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover" />
                                Français
                            </button>
                        </div>
                    </div>
                )}
                {/* Bouton d'aide */}
                <button className="bg-[#229954] p-3 rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all">
                    <span className="text-white font-badtyp text-xl md:text-2xl">?</span>
                </button>
            </div>
        </div>
    );
}

export default WaitingScreen