type Listener<T extends unknown[]> = (...args: T) => void;

type EventBus<Events extends Record<string, unknown[]>> = {
  on<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void;
  off<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void;
  emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
};

export const createEventBus = <Events extends Record<string, unknown[]>>(): EventBus<Events> => {
  const listeners: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  const on = <K extends keyof Events>(event: K, callback: Listener<Events[K]>) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event]!.push(callback);
  };

  const off = <K extends keyof Events>(event: K, callback: Listener<Events[K]>) => {
    if (!listeners[event]) {
      throw new Error(`Нет события: ${String(event)}`);
    }
    listeners[event] = listeners[event]!.filter((listener) => listener !== callback);
  };

  const emit = <K extends keyof Events>(event: K, ...args: Events[K]) => {
    if (!listeners[event]) {
      throw new Error(`Нет события: ${String(event)}`);
    }
    listeners[event]!.forEach((listener) => listener(...args));
  };

  return { on, off, emit };
};
