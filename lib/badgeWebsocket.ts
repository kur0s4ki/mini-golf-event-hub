import { getBadgeWebSocketUrl } from '@/lib/config';

interface BadgeMessage {
  action: string;
  data: string;
}

type BadgeEventCallback = (badgeId: string) => void;

class BadgeWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventCallbacks: BadgeEventCallback[] = [];

  constructor() {
    this.initializeUrl();
  }

  private async initializeUrl() {
    try {
      this.url = await getBadgeWebSocketUrl();
      console.log('Badge WebSocket URL:', this.url);
    } catch (error) {
      console.error('Failed to get badge WebSocket URL:', error);
      this.url = 'ws://localhost:8000'; // fallback
    }
  }

  async connect() {
    if (!this.url) {
      await this.initializeUrl();
    }

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.log('Badge WebSocket already connected or connecting');
      return;
    }

    console.log(`Connecting to Badge WebSocket at ${this.url}`);
    this.ws = new WebSocket(this.url!);

    this.ws.onopen = () => {
      console.log('Badge WebSocket Connected');
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };

    this.ws.onclose = (event) => {
      console.log(`Badge WebSocket Disconnected: ${event.code} ${event.reason}`);
      this.ws = null;

      // Only attempt to reconnect if not a normal closure
      if (
        event.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        const delay = Math.min(
          1000 * Math.pow(2, this.reconnectAttempts),
          30000,
        );
        console.log(
          `Attempting to reconnect to Badge WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`,
        );

        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Badge WebSocket Error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received badge message:', data);

        // Handle badge_in messages from your NFC server
        this.handleIncomingMessage(data);
      } catch (error) {
        console.error('Error parsing Badge WebSocket message:', error);
      }
    };
  }

  // Handle incoming messages from the badge server
  private handleIncomingMessage(message: any) {
    // Check if this is a badge_in message from your NFC server
    if (message.action === 'badge_in' && message.data) {
      const badgeId = message.data.toString().trim();
      console.log(`Badge scanned: ${badgeId}`);
      
      // Notify all registered callbacks
      this.eventCallbacks.forEach(callback => {
        try {
          callback(badgeId);
        } catch (error) {
          console.error('Error in badge event callback:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Register a callback for badge scan events
  onBadgeScanned(callback: BadgeEventCallback) {
    this.eventCallbacks.push(callback);
  }

  // Remove a callback
  offBadgeScanned(callback: BadgeEventCallback) {
    const index = this.eventCallbacks.indexOf(callback);
    if (index > -1) {
      this.eventCallbacks.splice(index, 1);
    }
  }

  // Clear all callbacks
  clearCallbacks() {
    this.eventCallbacks = [];
  }
}

// Create a singleton instance
const badgeWsClient = new BadgeWebSocketClient();
export default badgeWsClient;
