import { PlayerInfo } from '@/types';

type EventsMap = {
  start: PlayerInfo;
  win: number;
  loss: number;
  timeUp: number;
  reset: null;
  bonus: number;
  unauthorized: { message: string };
};

class EventEmitter {
  private events = new Map<keyof EventsMap, Function[]>();

  on<K extends keyof EventsMap>(
    event: K,
    callback: (data: EventsMap[K]) => void,
  ) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  off<K extends keyof EventsMap>(
    event: K,
    callback: (data: EventsMap[K]) => void,
  ) {
    const handlers = this.events.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        this.events.delete(event);
      }
    }
  }

  emit<K extends keyof EventsMap>(event: K, data: EventsMap[K]) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((callback) => callback(data));
    }
  }
}

export const gameEvents = new EventEmitter();
