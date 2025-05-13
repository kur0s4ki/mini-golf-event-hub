const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const teamsData = [
  {
    id: 13,
    name: "AKATSUKI",
    playerCount: 1,
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
    playerCount: 2,
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
    playerCount: 1,
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
    playerCount: 2,
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
