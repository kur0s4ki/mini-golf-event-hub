
import React, { useEffect, useState } from "react";
import WaitingScreen from "@/components/WaitingScreen";
import GameScreen from "@/components/GameScreen";
import WinScreen from "@/components/WinScreen";
import { gameEvents } from "@/lib/eventEmitter";
import wsClient from "@/lib/websocket";

type GameState = "waiting" | "playing" | "won";

interface PlayerInfo {
  displayName: string;
  team: {
    name: string;
  };
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [playerName, setPlayerName] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [timerSeconds, setTimerSeconds] = useState<number>(300);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    wsClient.connect();

    // Return cleanup function to disconnect when component unmounts
    return () => {
      wsClient.disconnect();
    };
  }, []);

  useEffect(() => {
    // Setup event listeners
    const handleStart = (player: PlayerInfo) => {
      console.log("Game started for player:", player);
      
      // Update state
      setPlayerName(player.displayName);
      setTeamName(player.team.name);
      setTimerSeconds(300); // Fixed at 300 seconds
      setGameState("playing");
      
      // Send WebSocket message
      wsClient.sendMessage({
        action: "start",
        teamName: player.team.name,
        playerDisplayName: player.displayName,
        timer: 300
      });
    };

    const handleWin = (points: number) => {
      console.log("Game won with points:", points);
      
      // Update state
      setPoints(points);
      setGameState("won");
      
      // Send WebSocket message
      wsClient.sendMessage({
        action: "win",
        points: points
      });
    };

    const handleReset = () => {
      console.log("Game reset");
      
      // Reset state
      setGameState("waiting");
      setPlayerName("");
      setTeamName("");
      setPoints(0);
      
      // Send WebSocket message
      wsClient.sendMessage({
        action: "reset"
      });
    };

    // Register event handlers
    gameEvents.on("start", handleStart);
    gameEvents.on("win", handleWin);
    gameEvents.on("reset", handleReset);

    // Cleanup event handlers when component unmounts
    return () => {
      gameEvents.off("start", handleStart);
      gameEvents.off("win", handleWin);
      gameEvents.off("reset", handleReset);
    };
  }, []);

  // Debug functions for demonstration (to be removed in production)
  useEffect(() => {
    // This code is only for local testing and should be removed in production
    if (process.env.NODE_ENV === "development") {
      // Add some window methods to test the events
      (window as any).testStart = () => {
        gameEvents.emit("start", {
          displayName: "John Doe",
          team: { name: "Eagles" }
        });
      };
      
      (window as any).testWin = (pts = 750) => {
        gameEvents.emit("win", pts);
      };
      
      (window as any).testReset = () => {
        gameEvents.emit("reset");
      };
      
      console.log("Debug functions available: window.testStart(), window.testWin(points), window.testReset()");
    }
  }, []);

  // Render the appropriate screen based on game state
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto h-screen max-w-screen-lg px-4">
        {gameState === "waiting" && (
          <WaitingScreen />
        )}
        
        {gameState === "playing" && (
          <GameScreen 
            timerSeconds={timerSeconds}
            playerName={playerName}
            teamName={teamName}
          />
        )}
        
        {gameState === "won" && (
          <WinScreen points={points} />
        )}
      </div>
    </div>
  );
};

export default Index;
