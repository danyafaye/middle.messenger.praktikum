export enum STORE_EVENTS {
  UPDATED = 'store:updated',
}

export type StoreEvents = {
  [STORE_EVENTS.UPDATED]: [
    path: string,
    value: unknown,
    oldState: Record<string, unknown>,
    newState: Record<string, unknown>,
  ];
};

export type StoreState = Record<string, unknown>;
