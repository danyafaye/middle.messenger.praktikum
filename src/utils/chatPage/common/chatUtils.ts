import { BASE_URL_RESOURCES, ChatMessage } from '@api';
import { store } from '@store';
import { StoreState } from '@models';

export const getAvatarLink = (avatarData?: string): string => {
  if (!avatarData) return '/assets/avatarPlug.png';
  return `${BASE_URL_RESOURCES}${avatarData}`;
};

export const getChatMessages = (chatId: string): ChatMessage[] => {
  const state = store.getState<StoreState>();
  const chatMessagesById = state.chatMessagesById as Record<string, ChatMessage[]>;
  return chatMessagesById?.[chatId] || [];
};

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }) as T;
};

export const createTimeoutManager = () => {
  const timeouts = new Map<string, NodeJS.Timeout>();

  return {
    set: (key: string, callback: () => void, delay: number) => {
      const existingTimeout = timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeoutId = setTimeout(() => {
        callback();
        timeouts.delete(key);
      }, delay);

      timeouts.set(key, timeoutId);
    },

    clear: (key: string) => {
      const timeoutId = timeouts.get(key);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeouts.delete(key);
      }
    },

    clearAll: () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    },

    has: (key: string) => timeouts.has(key),
  };
};
