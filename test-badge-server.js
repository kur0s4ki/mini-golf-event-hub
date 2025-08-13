const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 8000,
});

console.log("Test Badge Server running on port 8000");

wss.on("connection", function connection(ws) {
  console.log("Client connected to badge server");

  // Send a test badge message after 3 seconds
  setTimeout(() => {
    const testMessage = {
      action: "badge_in",
      data: "123456"
    };
    console.log("Sending test badge message:", testMessage);
    ws.send(JSON.stringify(testMessage));
  }, 3000);

  ws.on("close", () => {
    console.log("Client disconnected from badge server");
  });
});

// Send test messages every 10 seconds
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        action: "badge_in",
        data: Math.random().toString(36).substring(7).toUpperCase()
      };
      console.log("Sending periodic test badge message:", testMessage);
      ws.send(JSON.stringify(testMessage));
    }
  });
}, 10000);
