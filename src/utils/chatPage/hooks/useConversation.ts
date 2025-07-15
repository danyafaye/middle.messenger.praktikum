import { BlockInstance, ConversationState, WebSocketStatus } from '@models';
import { ChatsListInfo, UserData } from '@api';
import { loadChatUsers } from '@services';
import { store } from '@store';
import { createMessagesHash, debounce, getChatMessages } from '@utils';
import { createConversationBlock } from '@pages';

export const useConversation = (
  onConversationUpdate: (conversation: BlockInstance | null) => void
) => {
  let conversation: BlockInstance | null = null;
  let lastConversationState: ConversationState = {
    chatId: null,
    messagesCount: 0,
    messagesHash: '',
    websocketConnected: false,
    websocketLoading: false,
  };

  const updateConversation = debounce(async (): Promise<void> => {
    const selectedPersonId = store.getState<number>('selectedChatId');
    const currentChats = store.getState<ChatsListInfo[]>('chats') || [];
    const currentUser = store.getState<UserData>('user');
    const actualWebsocketStatus = store.getState<WebSocketStatus>('websocket');

    if (!selectedPersonId) {
      conversation = null;
      onConversationUpdate(null);
      return;
    }

    const chatIdString = selectedPersonId.toString();
    const currentMessages = getChatMessages(chatIdString);
    const currentMessagesHash = createMessagesHash(currentMessages);

    const currentState: ConversationState = {
      chatId: chatIdString,
      messagesCount: currentMessages.length,
      messagesHash: currentMessagesHash,
      websocketConnected: actualWebsocketStatus?.connected || false,
      websocketLoading: actualWebsocketStatus?.loadingMessages || false,
    };

    // Оптимизация: обновляем только при реальных изменениях
    const shouldUpdate =
      lastConversationState.chatId !== currentState.chatId ||
      lastConversationState.messagesHash !== currentState.messagesHash ||
      lastConversationState.websocketConnected !== currentState.websocketConnected ||
      lastConversationState.websocketLoading !== currentState.websocketLoading;

    if (shouldUpdate) {
      const isInitialLoad = lastConversationState.chatId !== currentState.chatId;

      if (isInitialLoad) {
        await loadChatUsers(chatIdString);
      }

      conversation = createConversationBlock(
        chatIdString,
        currentUser,
        currentChats,
        actualWebsocketStatus,
        isInitialLoad
      );

      onConversationUpdate(conversation);
      lastConversationState = currentState;
    }
  }, 50);

  const resetConversation = () => {
    conversation = null;
    lastConversationState = {
      chatId: null,
      messagesCount: 0,
      messagesHash: '',
      websocketConnected: false,
      websocketLoading: false,
    };
  };

  return {
    updateConversation,
    resetConversation,
    getCurrentConversation: () => conversation,
    getLastState: () => ({ ...lastConversationState }),
  };
};
