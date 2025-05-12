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

// Simple Cache for top teams data
let topTeamsCache: {
  day: TeamScore[];
  month: TeamScore[];
  year: TeamScore[];
} = {
  day: [],
  month: [],
  year: [],
};

// Function to fetch top teams for a specific period (day, month, year)
// Renamed for clarity, returns empty array on error
async function fetchTopTeams(period: "day" | "month" | "year"): Promise<TeamScore[]> {
  try {
    console.log(`CLIENT: Fetching /top-teams/${period}`);
    const response = await fetch(`http://localhost:3001/top-teams/${period}`);
    if (!response.ok) {
      console.error(
        `CLIENT: Failed fetch /top-teams/${period}, status: ${response.status}`
      );
      return []; // Return empty on error
    }
    const data = await response.json();
    console.log(`CLIENT: Received ${data.length} teams for /top-teams/${period}`);
    return data;
  } catch (error) {
    console.error(`CLIENT: Error fetching /top-teams/${period}:`, error);
    return []; // Return empty on error
  }
}

// Flag for initial load
let isFirstLoad = true;
// Track the highest score seen since the last refresh of top lists
let highestScoreSinceLastRefresh = 0;

// Function to fetch leaderboard data from the backend
export async function fetchLeaderboardData(): Promise<LeaderboardData> {
  let currentGames: TeamScore[] = []; // Initialize to empty
  let serverData: ServerTeamData[] = [];

  try {
    // --- Step 1: Always Fetch Current Games --- 
    const teamsResponse = await fetch("http://localhost:3001/teams");
    if (!teamsResponse.ok) {
      console.error(
        `CLIENT: Failed fetch /teams, status: ${teamsResponse.status}`
      );
      // Can't proceed without teams data, return last known cache state
      return {
        currentGames: [], // No current game data available
        topTeamsDay: topTeamsCache.day,
        topTeamsMonth: topTeamsCache.month,
        topTeamsYear: topTeamsCache.year,
      };
    }
    serverData = await teamsResponse.json();
    currentGames = serverData
      .filter((team) => team.session.status === "IN_PROGRESS") // Only IN_PROGRESS needed for UI
      .map((team) => ({
        teamName: team.name,
        numberOfPlayers: team.playerCount,
        score: team.points,
        timeLeft: team.session.duration,
        initialDuration: team.gamePlay.duration,
      }))
      .sort((a, b) => b.score - a.score);

    // --- Step 2: Determine if Top Teams Refresh is Needed --- 
    let needsFullRefresh = false;
    let maxCurrentScore = 0;
    if (serverData.length > 0) {
      // Consider scores from all teams fetched (including FINISHED)
      maxCurrentScore = Math.max(...serverData.map(t => t.points)); 
    }

    if (isFirstLoad) {
      console.log("CLIENT: First load, triggering refresh.");
      needsFullRefresh = true;
      highestScoreSinceLastRefresh = maxCurrentScore; // Initialize tracker
      isFirstLoad = false;
    } else {
      // Trigger refresh only if a new peak score is observed
      if (maxCurrentScore > highestScoreSinceLastRefresh) {
        console.log(
          `CLIENT: New peak score ${maxCurrentScore} > ${highestScoreSinceLastRefresh}. Triggering refresh.`
        );
        needsFullRefresh = true;
        // We update highestScoreSinceLastRefresh AFTER the fetch is successful
      } else {
         // Keep tracker updated even if no refresh triggered
         highestScoreSinceLastRefresh = Math.max(highestScoreSinceLastRefresh, maxCurrentScore);
      }
    }

    // --- Step 3: Perform Refresh if Needed --- 
    if (needsFullRefresh) {
      console.log("CLIENT: Performing full refresh of top teams...");
      try {
        const [dayData, monthData, yearData] = await Promise.all([
          fetchTopTeams("day"),
          fetchTopTeams("month"),
          fetchTopTeams("year"),
        ]);
        // Update cache ONLY if fetches were successful (data is not empty array)
        if (dayData.length > 0 || monthData.length > 0 || yearData.length > 0) {
           topTeamsCache.day = dayData;
           topTeamsCache.month = monthData;
           topTeamsCache.year = yearData;
           // IMPORTANT: Update the tracker *after* successful refresh
           highestScoreSinceLastRefresh = Math.max(highestScoreSinceLastRefresh, maxCurrentScore);
           console.log("CLIENT: Top teams cache updated. New highest score tracked: ", highestScoreSinceLastRefresh);
        } else {
           console.log("CLIENT: Top team fetch resulted in empty data, cache not updated.")
        }
      } catch (error) {
        console.error("CLIENT: Error during Promise.all for top teams fetch.", error);
      }
    }

    // --- Step 4: Return Data --- 
    // Return the latest currentGames and the current state of topTeamsCache
    return {
      currentGames: currentGames, 
      topTeamsDay: topTeamsCache.day,
      topTeamsMonth: topTeamsCache.month,
      topTeamsYear: topTeamsCache.year,
    };

  } catch (error) {
    // General error during the process
    console.error("CLIENT: General error in fetchLeaderboardData:", error);
    // Return potentially stale current games and whatever is in the cache
    return {
      currentGames: currentGames, // Return games fetched before error if available
      topTeamsDay: topTeamsCache.day,
      topTeamsMonth: topTeamsCache.month,
      topTeamsYear: topTeamsCache.year,
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
