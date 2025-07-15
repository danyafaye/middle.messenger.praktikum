export const createScrollManager = () => {
  const scrollPositions = new Map<string, boolean>();

  return {
    getScrollPosition: (chatId: string): boolean => {
      return scrollPositions.get(chatId) !== false;
    },

    setScrollPosition: (chatId: string, isAtBottom: boolean) => {
      scrollPositions.set(chatId, isAtBottom);
    },

    clearScrollPosition: (chatId: string) => {
      scrollPositions.delete(chatId);
    },

    clearAll: () => {
      scrollPositions.clear();
    },

    handleScroll: (chatId: string, container: HTMLElement) => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <= 50;
      scrollPositions.set(chatId, isAtBottom);
    },

    scrollToBottom: (chatId: string, container: HTMLElement, force = false) => {
      const shouldScroll = force || scrollPositions.get(chatId) !== false;

      if (shouldScroll) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
          scrollPositions.set(chatId, true);
        }, 50);
      }
    },
  };
};
