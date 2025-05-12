// Types for leaderboard data
export interface TeamScore {
  teamName: string;
  numberOfPlayers: number;
  score: number;
  timeLeft?: number; // Only for current games
  initialDuration?: number; // Add initial duration
}

export interface LeaderboardData {
  currentGames: TeamScore[];
  topTeamsDay: TeamScore[];
  topTeamsMonth: TeamScore[];
  topTeamsYear: TeamScore[];
}

// Interface for the raw data from the server
interface ServerTeamData {
  id: number;
  name: string;
  playerCount: number;
  points: number;
  session: {
    id: number;
    timestamp: string;
    duration: number; // Assuming this is time left in seconds
    status: "IN_PROGRESS" | "NOT_STARTED" | "FINISHED";
  };
  gamePlay: {
    id: number;
    description: string;
    duration: number;
  };
  language: {
    id: number;
    code: string;
    name: string;
  };
}

// Function to fetch leaderboard data from the backend
export async function fetchLeaderboardData(): Promise<LeaderboardData> {
  try {
    const response = await fetch('http://localhost:3001/teams');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serverData: ServerTeamData[] = await response.json();

    // Transform server data into the format expected by the frontend
    const currentGames: TeamScore[] = serverData
      .filter(team => team.session.status === "IN_PROGRESS")
      .map(team => ({
        teamName: team.name,
        numberOfPlayers: team.playerCount,
        score: team.points,
        // Assuming team.session.duration is the remaining time in seconds
        timeLeft: team.session.duration,
        initialDuration: team.gamePlay.duration // Map initial duration
      }))
      // Sort by score descending for current games display
      .sort((a, b) => b.score - a.score);

    // Return the transformed data - Top teams are empty as the endpoint doesn't provide them
    return {
      currentGames: currentGames,
      topTeamsDay: [],
      topTeamsMonth: [],
      topTeamsYear: [],
    };

  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    // Return empty data in case of error
    return {
      currentGames: [],
      topTeamsDay: [],
      topTeamsMonth: [],
      topTeamsYear: [],
    };
  }
}

// Function to update leaderboard data in real-time (if needed)
export function setupLeaderboardSocket() {
  // Implement WebSocket connection for real-time updates
  // This would connect to your backend's WebSocket endpoint
  // and update the leaderboard data in real-time
  // Example implementation (commented out):
  /*
  const ws = new WebSocket('your-backend-websocket-url');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update your state with the new data
    // You would need to implement a state management solution
    // to update the UI with this new data
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    ws.close();
  };
  */
}
