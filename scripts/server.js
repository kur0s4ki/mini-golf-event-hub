const WebSocket = require("ws");
const readline = require("readline");

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Keep track of all connected clients
const clients = new Set();

// Handle new connections
wss.on("connection", (ws) => {
  console.log("New client connected!");

  // Add this client to our set
  clients.add(ws);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "info",
      message: "Connected to game simulation server",
    })
  );

  // Handle messages from this client
  ws.on("message", (messageData) => {
    try {
      const message = JSON.parse(messageData);
      console.log("Received:", message);

      // Broadcast the message to all connected clients (including the sender)
      broadcastMessage(message);
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Function to broadcast a message to all connected clients
function broadcastMessage(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Setup command-line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Listen for 'x' key to send a hardcoded 'start' command (same structure as interactive start)
process.stdin.on("data", (chunk) => {
  const key = chunk.toString().trim().toLowerCase();
  if (key === "x") {
    const message = {
      action: "start",
      gameName: "Mini Golf Masters",
      instructions:
        "Visez le trou en un minimum de coups. Utilisez les rebonds pour éviter les obstacles !",
      playerDisplayName: "Jean Dupont",
      timer: 90,
    };
    broadcastMessage(message);
    console.log("Game started for: Jean Dupont (via X key)");
    // Prompt for next command, just like processGameCommand
    handleCommand();
  }
});

// Command handler function
function handleCommand() {
  rl.question(
    "\nEnter command (start, win, end, loss, timeUp, reset, bonus, b, help, exit): ",
    (cmd) => {
      const command = cmd.trim().toLowerCase();

      if (command === "exit") {
        console.log("Closing server...");
        rl.close();
        wss.close();
        process.exit(0);
      } else if (command === "help") {
        showHelp();
        handleCommand();
      } else if (
        [
          "start",
          "win",
          "end",
          "loss",
          "timeup",
          "reset",
          "bonus",
          "b",
        ].includes(command)
      ) {
        processGameCommand(command);
      } else {
        console.log('Unknown command. Type "help" for available commands.');
        handleCommand();
      }
    }
  );
}

// Display available commands and their descriptions
function showHelp() {
  console.log("\n--- Available Commands ---");
  console.log("start  : Start a new game with player information");
  console.log("win    : Trigger win screen (with optional points)");
  console.log("end    : Alternative to win (with optional points)");
  console.log("loss   : Trigger loss screen (with optional points)");
  console.log("timeup : Trigger time's up screen (with optional points)");
  console.log("bonus  : Show bonus animation with custom points");
  console.log("reset  : Reset game to waiting screen");
  console.log("help   : Show this help message");
  console.log("exit   : Close the server and exit");
  console.log("------------------------\n");
}

// Process game-related commands
function processGameCommand(command) {
  switch (command) {
    case "start":
      rl.question("Enter player name: ", (playerName) => {
        rl.question("Enter team name: ", (teamName) => {
          rl.question("Enter game name: ", (gameName) => {
            rl.question("Enter instructions: ", (instructions) => {
              rl.question("Enter timer (seconds): ", (timerStr) => {
                const timer = parseInt(timerStr) || 120;
                const message = {
                  action: "start",
                  gameName: gameName || "Pinball",
                  instructions:
                    instructions ||
                    "Shoot through the castle gate as many times as possible.",
                  playerDisplayName: playerName || "Player 1",
                  teamName: teamName || "Aigles", // Default to "Aigles" if teamName is not provided
                  timer: timer,
                };
                broadcastMessage(message);
                console.log(
                  "Game started for:",
                  playerName,
                  "from team:",
                  teamName
                );
                handleCommand();
              });
            });
          });
        });
      });
      break;

    case "win":
    case "loss":
    case "timeup":
    case "end":
      rl.question("Enter points (default: 1000): ", (pointsStr) => {
        const points = parseInt(pointsStr) || 1000;
        let action = command;
        if (command === "timeup") action = "timeUp"; // Fix casing for timeUp

        const message = {
          action: action,
          points: points,
        };
        broadcastMessage(message);
        console.log(`Triggered ${action} with ${points} points`);
        handleCommand();
      });
      break;

    case "bonus":
      rl.question("Enter number of bonus points: ", (bonusPoints) => {
        const points = parseInt(bonusPoints, 10) || 0;
        const message = {
          action: "bonus",
          points,
        };
        broadcastMessage(message);
        console.log(`Bonus animation triggered with ${points} points`);
        handleCommand();
      });
      break;

    case "reset":
      broadcastMessage({ action: "reset" });
      console.log("Game reset to waiting screen");
      handleCommand();
      break;
  }
}

console.log("WebSocket server started on port 8080");
console.log('Command interface ready. Type "help" for available commands.');
handleCommand();
