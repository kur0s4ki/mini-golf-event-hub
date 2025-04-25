export interface PlayerInfo {
  displayName: string;
  team: {
    name: string;
  };
  gameName?: string;
  instructions?: string;
  timer?: number;
}

export type GameState = "waiting" | "playing" | "won" | "lost" | "timeUp";

export interface WebSocketMessage {
  action: "start" | "win" | "loss" | "timeUp" | "reset";
  teamName?: string;
  playerDisplayName?: string;
  timer?: number;
  points?: number;
}
