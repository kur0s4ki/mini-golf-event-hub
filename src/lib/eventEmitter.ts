
type EventCallback = (...args: any[]) => void;

/**
 * Simple event emitter for handling game events
 */
class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(
      (cb) => cb !== callback
    );
  }

  /**
   * Emit an event with data
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach((callback) => {
      callback(...args);
    });
  }

  /**
   * Subscribe to an event for one-time execution
   */
  once(event: string, callback: EventCallback): void {
    const onceCallback = (...args: any[]) => {
      this.off(event, onceCallback);
      callback(...args);
    };
    
    this.on(event, onceCallback);
  }
}

// Create a singleton instance
export const gameEvents = new EventEmitter();

export default gameEvents;
