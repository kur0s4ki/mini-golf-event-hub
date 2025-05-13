const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const teamsData = [
  {
    id: 13,
    name: "AKATSUKI",
    playerCount: 4,
    points: 2105,
    session: {
      id: 12,
      timestamp: "2025-05-09T11:39:41.659344Z",
      duration: 1800,
      status: "IN_PROGRESS",
    },
    gamePlay: {
      id: 1,
      description: "1h",
      duration: 3600,
    },
    language: {
      id: 1,
      code: "FR",
      name: "Français",
    },
  },
  {
    id: 11,
    name: "LOS POTOS",
    playerCount: 4,
    points: 2057,
    session: {
      id: 10,
      timestamp: "2025-04-06T02:54:41.013407Z",
      duration: 146,
      status: "IN_PROGRESS",
    },
    gamePlay: {
      id: 1,
      description: "1h",
      duration: 3600,
    },
    language: {
      id: 1,
      code: "FR",
      name: "Français",
    },
  },
  {
    id: 14,
    name: "MIKHRAR",
    playerCount: 4,
    points: 1845,
    session: {
      id: 13,
      timestamp: "2025-04-06T02:08:37.454883Z",
      duration: 1216,
      status: "IN_PROGRESS",
    },
    gamePlay: {
      id: 1,
      description: "1h",
      duration: 3600,
    },
    language: {
      id: 1,
      code: "FR",
      name: "Français",
    },
  },
  {
    id: 10,
    name: "HALLA CHOPIS",
    playerCount: 4,
    points: 800,
    session: {
      id: 9,
      timestamp: "2025-04-20T16:51:15.821315Z",
      duration: 250,
      status: "IN_PROGRESS",
    },
    gamePlay: {
      id: 1,
      description: "1h",
      duration: 3600,
    },
    language: {
      id: 1,
      code: "FR",
      name: "Français",
    },
  },
];

// Background interval to decrease duration
setInterval(() => {
  teamsData.forEach((team) => {
    const session = team.session;
    if (session.status === "IN_PROGRESS" && session.duration > 0) {
      session.duration -= 1;
      if (session.duration <= 0) {
        session.duration = 0;
        // Mark session as FINISHED when duration reaches 0
        // This will make it disappear from "equipes en cours"
        session.status = "FINISHED";
      }

      if (session.duration === 1790) {
        team.points = 4900; // Update points, not score
        console.log(
          `SERVER: Team ${team.name} has improved ranking with score ${team.points} - This should trigger all three endpoint calls (day, month, year)`
        );

        // Update top teams data when a team's score improves
        // Check if the team's score is better than any in the top teams
        const updateTopTeams = (topTeams) => {
          // If the team's score is better than the lowest score in the top teams, add it
          const lowestScore = Math.min(...topTeams.map((t) => t.score));
          if (team.points > lowestScore) {
            // Check if the team already exists in the top teams
            const existingIndex = topTeams.findIndex(
              (t) => t.teamName === team.name
            );
            if (existingIndex >= 0) {
              // Update the team's score
              topTeams[existingIndex].score = team.points;
            } else {
              // Add the team to the top teams
              topTeams.push({
                teamName: team.name,
                numberOfPlayers: team.playerCount,
                score: team.points,
              });
              // Remove the team with the lowest score
              const lowestIndex = topTeams.findIndex(
                (t) => t.score === lowestScore
              );
              if (lowestIndex >= 0) {
                topTeams.splice(lowestIndex, 1);
              }
            }
            // Sort the top teams by score (descending)
            topTeams.sort((a, b) => b.score - a.score);
          }
        };

        // Update all top teams
        updateTopTeams(topTeamsDay);
        updateTopTeams(topTeamsMonth);
        updateTopTeams(topTeamsYear);
      }
    }
  });
}, 1000); // Run every second

// Sample data for top teams
const topTeamsDay = [
  { teamName: "DOLPHIN", numberOfPlayers: 3, score: 3200 },
  { teamName: "MAZAMIR", numberOfPlayers: 2, score: 2800 },
  { teamName: "IBA9OYIN", numberOfPlayers: 4, score: 2500 },
];

const topTeamsMonth = [
  { teamName: "LOS HOMBRES", numberOfPlayers: 3, score: 4100 },
  { teamName: "3WAZA", numberOfPlayers: 2, score: 3900 },
  { teamName: "LES SINGES", numberOfPlayers: 4, score: 3600 },
];

const topTeamsYear = [
  { teamName: "SIDIAMROU MOUSSA", numberOfPlayers: 5, score: 5500 },
  { teamName: "BOUTAZOUT", numberOfPlayers: 3, score: 5200 },
  { teamName: "BOFAQOCH", numberOfPlayers: 4, score: 4800 },
];

// Sample player data for teams
const playersData = {
  // Team ID 13 - AKATSUKI
  13: [
    {
      id: 101,
      name: "Naruto",
      uid: "UID001",
      scores: [450, 380, 420, 300, 290, 265, 0],
    },
    {
      id: 102,
      name: "Sasuke",
      uid: "UID002",
      scores: [430, 360, 400, 280, 270, 245, 0],
    },
    {
      id: 103,
      name: "Sakura",
      uid: "UID003",
      scores: [410, 340, 380, 260, 250, 225, 0],
    },
    {
      id: 104,
      name: "Kakashi",
      uid: "UID004",
      scores: [470, 400, 440, 320, 310, 285, 0],
    },
  ],
  // Team ID 11 - LOS POTOS
  11: [
    {
      id: 105,
      name: "Miguel",
      uid: "UID005",
      scores: [520, 410, 380, 350, 0, 0, 397],
    },
    {
      id: 106,
      name: "Carlos",
      uid: "UID006",
      scores: [480, 390, 360, 320, 0, 0, 0],
    },
    {
      id: 107,
      name: "Sofia",
      uid: "UID007",
      scores: [500, 400, 370, 335, 0, 0, 0],
    },
    {
      id: 108,
      name: "Elena",
      uid: "UID008",
      scores: [460, 380, 350, 310, 0, 0, 0],
    },
  ],
  // Team ID 14 - MIKHRAR
  14: [
    {
      id: 109,
      name: "Ahmed",
      uid: "UID009",
      scores: [490, 420, 380, 300, 255, 0, 0],
    },
    {
      id: 110,
      name: "Youssef",
      uid: "UID010",
      scores: [470, 400, 360, 280, 235, 0, 0],
    },
    {
      id: 111,
      name: "Fatima",
      uid: "UID011",
      scores: [450, 380, 340, 260, 215, 0, 0],
    },
    {
      id: 112,
      name: "Amir",
      uid: "UID012",
      scores: [510, 440, 400, 320, 275, 0, 0],
    },
  ],
  // Team ID 10 - HALLA CHOPIS
  10: [
    {
      id: 113,
      name: "Sophie",
      uid: "UID013",
      scores: [220, 180, 150, 0, 0, 0, 0],
    },
    {
      id: 114,
      name: "Emma",
      uid: "UID014",
      scores: [250, 0, 0, 0, 0, 0, 0],
    },
    {
      id: 115,
      name: "Lucas",
      uid: "UID015",
      scores: [200, 160, 130, 0, 0, 0, 0],
    },
    {
      id: 116,
      name: "Hugo",
      uid: "UID016",
      scores: [230, 170, 140, 0, 0, 0, 0],
    },
  ],
};

// Endpoint for all teams
app.get("/teams", (req, res) => {
  res.json(teamsData);
});

// Endpoint for top teams of the day
app.get("/top-teams/day", (req, res) => {
  res.json(topTeamsDay);
});

// Endpoint for top teams of the month
app.get("/top-teams/month", (req, res) => {
  res.json(topTeamsMonth);
});

// Endpoint for top teams of the year
app.get("/top-teams/year", (req, res) => {
  res.json(topTeamsYear);
});

// Endpoint for team info by UID
app.get("/team-info/:uid", (req, res) => {
  const uid = req.params.uid;

  // Find the player with the given UID
  let playerInfo = null;
  let teamInfo = null;

  // Search through all teams and players
  for (const teamId in playersData) {
    const players = playersData[teamId];
    const player = players.find((p) => p.uid === uid);

    if (player) {
      playerInfo = player;
      // Find the team this player belongs to
      teamInfo = teamsData.find((t) => t.id === parseInt(teamId));
      break;
    }
  }

  if (!playerInfo || !teamInfo) {
    return res.status(404).json({ error: "Player or team not found" });
  }

  // Get all players in this team
  const teamPlayers = playersData[teamInfo.id];

  // Calculate total score for each player
  const playersWithTotalScore = teamPlayers.map((player) => {
    const totalScore = player.scores.reduce((sum, score) => sum + score, 0);
    return {
      ...player,
      totalScore,
    };
  });

  // Sort players by total score (descending)
  playersWithTotalScore.sort((a, b) => b.totalScore - a.totalScore);

  // Return team and player information
  res.json({
    team: {
      id: teamInfo.id,
      name: teamInfo.name,
      playerCount: teamInfo.playerCount,
      points: teamInfo.points,
      session: teamInfo.session,
      gamePlay: teamInfo.gamePlay,
    },
    players: playersWithTotalScore,
    currentPlayer: playerInfo.uid,
    gameNames: [
      "Fortress",
      "Roller-Skate",
      "Skee-Ball",
      "Skyscraper",
      "Spiral",
      "Pinball",
      "Pinko",
    ],
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
