// Types for leaderboard data
export interface TeamScore {
  teamName: string;
  numberOfPlayers: number;
  score: number;
  timeLeft?: number; // Only for current games
}

export interface LeaderboardData {
  currentGames: TeamScore[];
  topTeamsDay: TeamScore[];
  topTeamsMonth: TeamScore[];
  topTeamsYear: TeamScore[];
}

// Mock data for development - replace with actual API calls
const mockLeaderboardData: LeaderboardData = {
  currentGames: [
    { teamName: "Aigles", numberOfPlayers: 4, score: 850, timeLeft: 170 },
    { teamName: "Faucons", numberOfPlayers: 3, score: 720, timeLeft: 90 },
    { teamName: "Lions", numberOfPlayers: 5, score: 680, timeLeft: 180 },
    { teamName: "Tigres", numberOfPlayers: 2, score: 540, timeLeft: 30 },
    { teamName: "Panthères", numberOfPlayers: 6, score: 490, timeLeft: 150 },
    { teamName: "Cobras", numberOfPlayers: 3, score: 450, timeLeft: 120 },
    { teamName: "Dragons", numberOfPlayers: 4, score: 420, timeLeft: 45 },
    { teamName: "Loups", numberOfPlayers: 5, score: 380, timeLeft: 75 },
    { teamName: "Requins", numberOfPlayers: 3, score: 350, timeLeft: 140 },
    { teamName: "Ours", numberOfPlayers: 4, score: 320, timeLeft: 20 },
    // { teamName: "Renards", numberOfPlayers: 2, score: 290, timeLeft: 160 },
    // { teamName: "Éléphants", numberOfPlayers: 6, score: 260, timeLeft: 85 },
    // { teamName: "Dauphins", numberOfPlayers: 3, score: 230, timeLeft: 130 },
    // { teamName: "Hiboux", numberOfPlayers: 4, score: 200, timeLeft: 15 },
    // { teamName: "Castors", numberOfPlayers: 2, score: 180, timeLeft: 110 },
  ],
  topTeamsDay: [
    { teamName: "Panthères", numberOfPlayers: 4, score: 950 },
    { teamName: "Aigles", numberOfPlayers: 4, score: 850 },
    { teamName: "Faucons", numberOfPlayers: 3, score: 720 },
    { teamName: "Lions", numberOfPlayers: 5, score: 680 },
    { teamName: "Tigres", numberOfPlayers: 2, score: 540 },
  ],
  topTeamsMonth: [
    { teamName: "Panthères", numberOfPlayers: 4, score: 1050 },
    { teamName: "Cobras", numberOfPlayers: 6, score: 980 },
    { teamName: "Aigles", numberOfPlayers: 4, score: 950 },
    { teamName: "Faucons", numberOfPlayers: 3, score: 920 },
    { teamName: "Lions", numberOfPlayers: 5, score: 880 },
  ],
  topTeamsYear: [
    { teamName: "Dragons", numberOfPlayers: 5, score: 1200 },
    { teamName: "Panthères", numberOfPlayers: 4, score: 1150 },
    { teamName: "Cobras", numberOfPlayers: 6, score: 1080 },
    { teamName: "Aigles", numberOfPlayers: 4, score: 1050 },
    { teamName: "Faucons", numberOfPlayers: 3, score: 1020 },
  ],
};

// Function to fetch leaderboard data from the backend
export async function fetchLeaderboardData(): Promise<LeaderboardData> {
  try {
    // Replace this with actual API call when backend is ready
    // const response = await fetch('your-backend-url/leaderboard');
    // const data = await response.json();
    // return data;

    // For now, return mock data with a simulated delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockLeaderboardData;
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
