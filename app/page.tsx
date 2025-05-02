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

            // Update state
            setPlayerName(player.displayName)
            setTeamName(player.team.name)
            setGameName(player.gameName || "")
            setInstructions(player.instructions || "")
            setTimerSeconds(player.timer || 20)
            setGameState("playing")

            // Send WebSocket message
            wsClient.sendMessage({
                action: "start",
                teamName: player.team.name,
                playerDisplayName: player.displayName,
                timer: player.timer || 20
            })
        }

        const handleWin = (points: number) => {
            console.log("Game won with points:", points)

            // Update state
            setPoints(points)
            setGameState("won")

            // Send WebSocket message
            wsClient.sendMessage({
                action: "win",
                points: points
            })
        }

        const handleLoss = (points: number) => {
            console.log("Game lost with points:", points)

            // Update state
            setPoints(points)
            setGameState("lost")

            // Send WebSocket message
            wsClient.sendMessage({
                action: "loss",
                points: points
            })
        }

        const handleTimeUp = (points: number) => {
            console.log("Time's up with points:", points)

            // Update state
            setPoints(points)
            setGameState("timeUp")

            // Send WebSocket message
            wsClient.sendMessage({
                action: "timeUp",
                points: points
            })
        }

        const handleReset = () => {
            console.log("Game reset")

            // Reset state
            setGameState("waiting")
            setPlayerName("")
            setTeamName("")
            setGameName("")
            setInstructions("")
            setPoints(0)

            // Send WebSocket message
            wsClient.sendMessage({
                action: "reset"
            })
        }

        // Register event handlers
        gameEvents.on("start", handleStart)
        gameEvents.on("win", handleWin)
        gameEvents.on("loss", handleLoss)
        gameEvents.on("timeUp", handleTimeUp)
        gameEvents.on("reset", handleReset)

        // Cleanup event handlers when component unmounts
        return () => {
            gameEvents.off("start", handleStart)
            gameEvents.off("win", handleWin)
            gameEvents.off("loss", handleLoss)
            gameEvents.off("timeUp", handleTimeUp)
            gameEvents.off("reset", handleReset)
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
                    team: { name: "Eagles" }
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
        <div className="h-full">
            {gameState === "waiting" && (
                <WaitingScreen />
            )}
            {gameState === "playing" && (
                <GameInProgress initialTime={timerSeconds} gameName={gameName} instructions={instructions} playerName={playerName} hideControls={true} />
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