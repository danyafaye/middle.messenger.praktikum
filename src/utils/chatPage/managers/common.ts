import { createModalManager, createScrollManager, createTimeoutManager } from '@utils';

export const modalManager = createModalManager();
export const scrollManager = createScrollManager();
export const timeoutManager = createTimeoutManager();

export const cleanupManagers = () => {
  modalManager.clearAll();
  scrollManager.clearAll();
  timeoutManager.clearAll();
};
