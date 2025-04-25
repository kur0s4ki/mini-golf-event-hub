"use client"

import React, { useEffect, useState } from 'react'
import { gameEvents } from "@/lib/eventEmitter"
import { PlayerInfo } from '@/types'

interface KeyboardSimulatorProps {
  isActive?: boolean
}

const KeyboardSimulator: React.FC<KeyboardSimulatorProps> = ({ 
  isActive = true 
}) => {
  const [activatedKeys, setActivatedKeys] = useState<string[]>([])
  const [bonusPoints, setBonusPoints] = useState(0)
  
  useEffect(() => {
    if (!isActive) return
    
    // Define the key mapping for different game actions
    const keyHandler = (event: KeyboardEvent) => {
      // Prevent default behaviors for these keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault()
      }
      
      // Add key to activated keys list (for UI display)
      if (!activatedKeys.includes(event.code)) {
        setActivatedKeys(prev => [...prev, event.code])
        
        // Remove key after 200ms (visual feedback)
        setTimeout(() => {
          setActivatedKeys(prev => prev.filter(key => key !== event.code))
        }, 200)
      }
      
      // Handle different key inputs
      switch (event.code) {
        case 'KeyS': // Start game
          gameEvents.emit("start", {
            displayName: "Player1",
            team: { name: "Team Alpha" }
          })
          console.log('🎮 Game Started')
          break
          
        case 'KeyW': // Win
          const winScore = 500 + Math.floor(Math.random() * 200) + bonusPoints
          gameEvents.emit("win", winScore)
          console.log(`🏆 Win: ${winScore} points`)
          break
          
        case 'KeyL': // Loss
          const lossScore = 200 + Math.floor(Math.random() * 100) + bonusPoints
          gameEvents.emit("loss", lossScore)
          console.log(`❌ Loss: ${lossScore} points`)
          break
          
        case 'KeyB': // Bonus
          const nextBonus = bonusPoints + 500
          setBonusPoints(nextBonus)
          console.log(`💰 Bonus: +500 (Total: ${nextBonus})`)
          // Simulate the button press by targeting game-in-progress directly
          const bonusButton = document.querySelector('[data-action="bonus"]') as HTMLButtonElement
          if (bonusButton) bonusButton.click()
          break
          
        case 'KeyT': // Time's up
          const timeUpScore = 100 + bonusPoints
          gameEvents.emit("timeUp", timeUpScore)
          console.log(`⏱️ Time's up: ${timeUpScore} points`)
          break
          
        case 'KeyR': // Reset
          gameEvents.emit("reset", null)
          setBonusPoints(0)
          console.log('🔄 Reset')
          break
      }
    }
    
    // Add event listeners
    window.addEventListener('keydown', keyHandler)
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', keyHandler)
    }
  }, [isActive, activatedKeys, bonusPoints])
  
  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-black/80 rounded-lg text-white font-mono text-xs">
      <div className="mb-2 font-bold">Keyboard Simulator</div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className={`p-1 ${activatedKeys.includes('KeyS') ? 'bg-green-500' : ''}`}>
          <span className="font-bold">[S]</span> Start Game
        </div>
        <div className={`p-1 ${activatedKeys.includes('KeyW') ? 'bg-green-500' : ''}`}>
          <span className="font-bold">[W]</span> Win
        </div>
        <div className={`p-1 ${activatedKeys.includes('KeyL') ? 'bg-red-500' : ''}`}>
          <span className="font-bold">[L]</span> Loss
        </div>
        <div className={`p-1 ${activatedKeys.includes('KeyB') ? 'bg-yellow-500' : ''}`}>
          <span className="font-bold">[B]</span> Bonus +1000
        </div>
        <div className={`p-1 ${activatedKeys.includes('KeyT') ? 'bg-blue-500' : ''}`}>
          <span className="font-bold">[T]</span> Time's Up
        </div>
        <div className={`p-1 ${activatedKeys.includes('KeyR') ? 'bg-purple-500' : ''}`}>
          <span className="font-bold">[R]</span> Reset
        </div>
      </div>
      {bonusPoints > 0 && (
        <div className="mt-2 text-yellow-400">
          Total Bonus: +{bonusPoints}
        </div>
      )}
    </div>
  )
}

export default KeyboardSimulator 