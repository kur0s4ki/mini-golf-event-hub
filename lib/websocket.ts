import { WebSocketMessage } from '@/types';
import { gameEvents } from '@/lib/eventEmitter';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Use environment variable with fallback for WebSocket URL
    // Include the /ws path required by NestJS
    this.url =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws';
    console.log('WebSocket URL:', this.url);
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    console.log(`Connecting to WebSocket at ${this.url}`);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
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
          30000,
        );
        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`,
        );

        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        // Handle different message types
        this.handleIncomingMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  // Handle incoming messages from the server
  private async handleIncomingMessage(message: any) {
    // Check if this is a game action message
    if (message.action) {
      switch (message.action) {
        case 'start':
          if (message.playerDisplayName) {
            const teamName = message.teamName || '';
            gameEvents.emit('start', {
              displayName: message.playerDisplayName,
              team: { name: teamName },
              gameName: message.gameName || '',
              instructions: message.instructions || '',
              timer: message.timer || 20,
            });
          }
          break;

        case 'win':
          if (typeof message.points === 'number') {
            gameEvents.emit('win', message.points);
          }
          break;
        case 'unauthorized':
          if (message.message) {
            gameEvents.emit('unauthorized', { message: message.message });
          }
          break;

        case 'end':
          if (typeof message.points === 'number') {
            // If score is 0, show loss screen, otherwise show win screen
            if (message.points === 0) {
              gameEvents.emit('loss', message.points);
            } else {
              gameEvents.emit('win', message.points);
            }
          }
          break;

        case 'loss':
          if (typeof message.points === 'number') {
            gameEvents.emit('loss', message.points);
          }
          break;

        case 'timeUp':
          if (typeof message.points === 'number') {
            gameEvents.emit('timeUp', message.points);
          }
          break;

        case 'reset':
          gameEvents.emit('reset', null);
          break;

        case 'bonus':
          if (typeof message.points === 'number') {
            gameEvents.emit('bonus', message.points);
          }
          break;

        case 'custom':
          // Handle custom commands like bonus
          if (message.command === 'bonus') {
            // Trigger the bonus display in GameInProgress component
            const gameInProgress = document.querySelector(
              '[data-bonus-trigger]',
            );
            if (gameInProgress) {
              const bonusButton = gameInProgress.querySelector(
                'button[data-bonus]',
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
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
  }

  // This method is intentionally empty - we don't send messages back
  sendMessage(message: WebSocketMessage) {
    // Do nothing - the app should never send messages
    console.log('Message sending disabled - app is passive receiver only');
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

const wsClient = new WebSocketClient();
export default wsClient;
