export interface PlayerInfo {
  displayName: string;
  team: {
    name: string;
  };
  gameName?: string;
  instructions?: string;
  timer?: number;
}

export type GameState = 'waiting' | 'playing' | 'won' | 'lost' | 'timeUp';

export interface WebSocketMessage {
  action:
    | 'start'
    | 'win'
    | 'loss'
    | 'timeUp'
    | 'reset'
    | 'end'
    | 'unauthorized';
  teamName?: string;
  playerDisplayName?: string;
  timer?: number;
  points?: number;
  message?: string;
}

export interface BadgeMessage {
  type: string;
  id: string;
  timestamp: string;
}
