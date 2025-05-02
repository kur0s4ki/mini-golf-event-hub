import { WebSocketMessage } from "@/types";
import { gameEvents } from "@/lib/eventEmitter";

class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageQueue: Set<string> = new Set(); // Track recently sent messages

  constructor() {
    // Use environment variable with fallback for WebSocket URL
    this.url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080";
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    console.log(`Connecting to WebSocket at ${this.url}`);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket Disconnected: ${event.code} ${event.reason}`);
      this.ws = null;

      // Only attempt to reconnect if not a normal closure
      if (
        event.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        const delay = Math.min(
          1000 * Math.pow(2, this.reconnectAttempts),
          30000
        );
        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`
        );

        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Create a message signature to detect duplicates
        const msgSignature = JSON.stringify(data);

        // Skip if we've seen this exact message recently (within last 500ms)
        if (this.messageQueue.has(msgSignature)) {
          console.log("Duplicate message detected, ignoring:", data);
          return;
        }

        // Add to recent messages queue
        this.messageQueue.add(msgSignature);

        // Remove from queue after 500ms to prevent memory leaks
        setTimeout(() => {
          this.messageQueue.delete(msgSignature);
        }, 500);

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
              team: { name: message.teamName || "Aigles" },
              gameName: message.gameName || "",
              instructions: message.instructions || "",
              timer: message.timer || 20,
            });
          }
          break;

        case "win":
        case "end": // Add end case that behaves like win
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
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Normal closure");
      this.ws = null;
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected, attempting to connect");
      this.connect();
      // Queue message to be sent after connection (could implement a proper queue system)
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

const wsClient = new WebSocketClient();
export default wsClient;
