export interface PlayerInfo {
  displayName: string;
  team: {
    name: string;
  };
}

export type GameState = "waiting" | "playing" | "won";

export interface WebSocketMessage {
  action: "start" | "win" | "reset";
  teamName?: string;
  playerDisplayName?: string;
  timer?: number;
  points?: number;
}
