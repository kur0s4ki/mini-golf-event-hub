"use client"

import React, { useEffect, useState } from "react"
import WaitingScreen from "@/components/waiting-screen"
import GameInProgress from "@/components/game-in-progress"
import WinScreen from "@/components/win-screen"
import LossScreen from "@/components/loss-screen"
import TimeUpScreen from "@/components/time-up-screen"
import KeyboardSimulator from "@/components/keyboard-simulator"
import { gameEvents } from "@/lib/eventEmitter"
import wsClient from "@/lib/websocket"
import { PlayerInfo, GameState } from "@/types"

export default function Home() {
    const [gameState, setGameState] = useState<GameState>("waiting")
    const [playerName, setPlayerName] = useState<string>("")
    const [teamName, setTeamName] = useState<string>("")
    const [gameName, setGameName] = useState<string>("")
    const [instructions, setInstructions] = useState<string>("")
    const [timerSeconds, setTimerSeconds] = useState<number>(20)
    const [points, setPoints] = useState<number>(0)
    const [unauthorizedMessage, setUnauthorizedMessage] = useState<string>("")

    useEffect(() => {
        // Connect to WebSocket when component mounts
        wsClient.connect()

        // Return cleanup function to disconnect when component unmounts
        return () => {
            wsClient.disconnect()
        }
    }, [])

    useEffect(() => {
        // Setup event listeners
        const handleStart = (player: PlayerInfo) => {
            console.log("Game started for player:", player)

            // Clear any unauthorized message when a new game starts
            setUnauthorizedMessage("")

            // Update state
            setPlayerName(player.displayName)
            setTeamName(player.team.name)
            setGameName(player.gameName || "")
            setInstructions(player.instructions || "")
            setTimerSeconds(player.timer || 20)
            setGameState("playing")
        }

        const handleWin = (points: number) => {
            console.log("Game won with points:", points)
            setPoints(points)
            setGameState("won")
        }

        const handleLoss = (points: number) => {
            console.log("Game lost with points:", points)
            setPoints(points)
            setGameState("lost")
        }

        const handleTimeUp = (points: number) => {
            console.log("Time's up with points:", points)
            setPoints(points)
            setGameState("timeUp")
        }

        const handleReset = () => {
            console.log("Game reset")
            setGameState("waiting")
            setPlayerName("")
            setTeamName("")
            setGameName("")
            setInstructions("")
            setPoints(0)
        }

        const handleBonus = (bonusPoints: number) => {
            console.log("Bonus points:", bonusPoints)
            // Handle bonus points display
        }

        // Register event listeners
        gameEvents.on("start", handleStart)
        gameEvents.on("win", handleWin)
        gameEvents.on("loss", handleLoss)
        gameEvents.on("timeUp", handleTimeUp)
        gameEvents.on("reset", handleReset)
        gameEvents.on("bonus", handleBonus)
        gameEvents.on("unauthorized", ({ message }) => {
            setUnauthorizedMessage(message || "Badge non autorisé")
            // Auto hide after 4 seconds
            setTimeout(() => setUnauthorizedMessage(""), 4000)
        })

        // Cleanup function to remove event listeners
        return () => {
            gameEvents.off("start", handleStart)
            gameEvents.off("win", handleWin)
            gameEvents.off("loss", handleLoss)
            gameEvents.off("timeUp", handleTimeUp)
            gameEvents.off("reset", handleReset)
            gameEvents.off("bonus", handleBonus)
            // unauthorized uses anonymous handler above; page unmount resets state anyway
        }
    }, [])

    // Debug functions for demonstration (to be removed in production)
    useEffect(() => {
        // This code is only for local testing and should be removed in production
        if (process.env.NODE_ENV === "development") {
            // Add some window methods to test the events
            (window as any).testStart = () => {
                gameEvents.emit("start", {
                    displayName: "John Doe",
                    team: { name: "Aigles" }
                })
            }

            (window as any).testWin = (pts = 750) => {
                gameEvents.emit("win", pts)
            }

            (window as any).testLoss = (pts = 350) => {
                gameEvents.emit("loss", pts)
            }

            (window as any).testTimeUp = (pts = 100) => {
                gameEvents.emit("timeUp", pts)
            }

            (window as any).testReset = () => {
                gameEvents.emit("reset", null)
            }

            console.log("Debug functions available: window.testStart(), window.testWin(points), window.testLoss(points), window.testTimeUp(points), window.testReset()")
        }
    }, [])

    return (
        <div className="h-full relative">
            {gameState === "waiting" && (
                <WaitingScreen unauthorizedMessage={unauthorizedMessage} />
            )}
            {gameState === "playing" && (
                <GameInProgress
                    initialTime={timerSeconds}
                    gameName={gameName}
                    instructions={instructions}
                    playerName={playerName}
                    teamName={teamName}
                    hideControls={true}
                />
            )}
            {gameState === "won" && (
                <WinScreen
                    points={points}
                    playerName={playerName}
                    teamName={teamName}
                />
            )}
            {gameState === "lost" && (
                <LossScreen
                    points={points}
                    playerName={playerName}
                    teamName={teamName}
                />
            )}
            {gameState === "timeUp" && (
                <TimeUpScreen
                    points={points}
                    playerName={playerName}
                    teamName={teamName}
                />
            )}



            {/* Keyboard simulator for development */}
            {/* {process.env.NODE_ENV === 'development' && (
                <KeyboardSimulator />
            )} */}
        </div>
    )
}


