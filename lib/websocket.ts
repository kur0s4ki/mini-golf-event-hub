import { WebSocketMessage } from "@/types";
import { gameEvents } from "@/lib/eventEmitter";

class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string = "ws://localhost:8080"; // Replace with your WebSocket server URL

  connect() {
    if (this.ws) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        // Handle different message types
        this.handleIncomingMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  // Handle incoming messages from the server
  private handleIncomingMessage(message: any) {
    // Check if this is a game action message
    if (message.action) {
      switch (message.action) {
        case "start":
          if (message.playerDisplayName) {
            gameEvents.emit("start", {
              displayName: message.playerDisplayName,
              team: { name: message.teamName || "" }, // Make sure teamName is properly extracted
              gameName: message.gameName || "",
              instructions: message.instructions || "",
              timer: message.timer || 20,
            });
          }
          break;

        case "win":
          if (typeof message.points === "number") {
            gameEvents.emit("win", message.points);
          }
          break;

        case "loss":
          if (typeof message.points === "number") {
            gameEvents.emit("loss", message.points);
          }
          break;

        case "timeUp":
          if (typeof message.points === "number") {
            gameEvents.emit("timeUp", message.points);
          }
          break;

        case "reset":
          gameEvents.emit("reset", null);
          break;

        case "bonus":
          if (typeof message.points === "number") {
            gameEvents.emit("bonus", message.points);
          }
          break;

        case "custom":
          // Handle custom commands like bonus
          if (message.command === "bonus") {
            // Trigger the bonus display in GameInProgress component
            const gameInProgress = document.querySelector(
              "[data-bonus-trigger]"
            );
            if (gameInProgress) {
              const bonusButton = gameInProgress.querySelector(
                "button[data-bonus]"
              ) as HTMLButtonElement;
              bonusButton?.click();
            }
          }
          break;
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

const wsClient = new WebSocketClient();
export default wsClient;
