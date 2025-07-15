import { createEventBus } from '@framework';
import { cloneDeep, isEqual, set } from '@utils';
import { STORE_EVENTS, StoreEvents, StoreState } from '@models';

const initialState: StoreState = {
  chatMessagesById: {},
  selectedChatId: null,
};

export const createStore = (init: StoreState = initialState) => {
  let state = cloneDeep(init) as StoreState;
  const eventBus = createEventBus<StoreEvents>();

  const getState = <T = unknown>(path?: string): T => {
    if (!path) {
      return cloneDeep(state as Record<string, unknown>) as unknown as T;
    }

    const keys = path.split('.');
    let current: unknown = state;

    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined as unknown as T;
      }

      current = (current as Record<string, unknown>)[key];
    }

    if (current === null || current === undefined) {
      return current as unknown as T;
    }

    return typeof current === 'object'
      ? (cloneDeep(current as Record<string, unknown>) as unknown as T)
      : (current as unknown as T);
  };

  const setState = <T = unknown>(path: string, value: T): void => {
    const oldState = cloneDeep(state as Record<string, unknown>) as StoreState;
    const newState = set(state, path, value) as StoreState;

    if (isEqual(oldState as Record<string, unknown>, newState as Record<string, unknown>)) {
      return;
    }

    state = newState;

    eventBus.emit(
      STORE_EVENTS.UPDATED,
      path,
      value as unknown,
      oldState,
      cloneDeep(state as Record<string, unknown>) as StoreState
    );
  };

  const subscribe = (
    callback: (path: string, value: unknown, oldState: StoreState, newState: StoreState) => void
  ): void => {
    eventBus.on(STORE_EVENTS.UPDATED, callback);
  };

  const unsubscribe = (
    callback: (path: string, value: unknown, oldState: StoreState, newState: StoreState) => void
  ): void => {
    eventBus.off(STORE_EVENTS.UPDATED, callback);
  };

  return {
    getState,
    setState,
    subscribe,
    unsubscribe,
  };
};

export const store = createStore();
