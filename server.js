const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const teamsData = [
  {
    id: 13,
    name: "h2c",
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
    name: "h2c",
    playerCount: 2,
    points: 2057,
    session: {
      id: 10,
      timestamp: "2025-04-06T02:54:41.013407Z",
      duration: 100,
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
    name: "h2c",
    playerCount: 1,
    points: 1845,
    session: {
      id: 13,
      timestamp: "2025-04-06T02:08:37.454883Z",
      duration: 600,
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
    name: "h2c",
    playerCount: 2,
    points: 800,
    session: {
      id: 9,
      timestamp: "2025-04-20T16:51:15.821315Z",
      duration: 200,
      status: "IN_PROGRESS",
    },
    gamePlay: {
      id: 1,
      description: "1h",
      duration: 2800,
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
    }
  });
}, 1000); // Run every second

app.get("/teams", (req, res) => {
  res.json(teamsData);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
