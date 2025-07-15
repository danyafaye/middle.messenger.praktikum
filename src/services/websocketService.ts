import { ChatMessage, chatsApi, ChatsListInfo, UserData, WebSocketMessage } from '@api';
import { store } from '@store';

let currentSocket: WebSocket | null = null;
let currentChatId: number | null = null;
let reconnectAttempts = 0;
let isConnecting = false;
let connectionPromise: Promise<void> | null = null;
let isRequestingMessages = false;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

const updateLastMessageInChatsList = (message: ChatMessage): void => {
  const currentChats = store.getState<ChatsListInfo[]>('chats') || [];
  const currentUser = store.getState<UserData>('user');

  if (!currentUser) return;

  const updatedChats = currentChats.map((chat) => {
    if (chat.id === message.chat_id) {
      return {
        ...chat,
        last_message: {
          user: {
            first_name: currentUser.first_name,
            second_name: currentUser.second_name,
            avatar: currentUser.avatar,
            email: currentUser.email,
            login: currentUser.login,
            phone: currentUser.phone,
          },
          time: message.time,
          content: message.content,
        },
      };
    }
    return chat;
  });

  store.setState('chats', updatedChats);
};

export const getChatToken = async (chatId: number): Promise<string> => {
  try {
    const response = await chatsApi.getChatToken(chatId);
    return response.token;
  } catch (error) {
    console.error('Ошибка получения токена чата:', error);
    throw error;
  }
};

export const connectToChat = async (chatId: number): Promise<void> => {
  if (currentChatId === chatId && currentSocket?.readyState === WebSocket.OPEN) {
    const existingMessages = store.getState<ChatMessage[]>(`chatMessagesById.${chatId}`) || [];
    if (existingMessages.length === 0 && !isRequestingMessages) {
      requestOldMessages();
    }
    return;
  }

  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = _connectToChatInternal(chatId);
  return connectionPromise;
};

const _connectToChatInternal = async (chatId: number): Promise<void> => {
  try {
    isConnecting = true;

    if (currentChatId !== chatId) {
      await _disconnectInternal();
    }

    const userData = store.getState<UserData>('user');
    if (!userData?.id) {
      throw new Error('Пользователь не авторизован');
    }

    const token = await getChatToken(chatId);
    const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userData.id}/${chatId}/${token}`;

    currentSocket = new WebSocket(wsUrl);
    currentChatId = chatId;

    store.setState('websocket', {
      connected: false,
      connecting: true,
      loadingMessages: true,
      chatId,
    });

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Таймаут подключения'));
      }, 10000);

      currentSocket!.onopen = () => {
        clearTimeout(timeoutId);
        handleSocketOpen();
        resolve();
      };

      currentSocket!.onmessage = handleSocketMessage;
      currentSocket!.onclose = handleSocketClose;
      currentSocket!.onerror = (error) => {
        clearTimeout(timeoutId);
        handleSocketError(error);
        reject(error);
      };
    });
  } catch (error) {
    console.error('Ошибка подключения к чату:', error);
    isConnecting = false;
    connectionPromise = null;
    store.setState('websocket', {
      connected: false,
      connecting: false,
      loadingMessages: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    });
    throw error;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
};

const _disconnectInternal = (): Promise<void> => {
  return new Promise((resolve) => {
    if (currentSocket) {
      const handleClose = () => {
        currentSocket = null;
        currentChatId = null;
        reconnectAttempts = 0;
        isRequestingMessages = false;
        resolve();
      };

      if (currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.onclose = handleClose;
        currentSocket.close(1000, 'Переключение на другой чат');
      } else {
        handleClose();
      }
    } else {
      resolve();
    }
  });
};

const handleSocketOpen = (): void => {
  reconnectAttempts = 0;

  store.setState('websocket', {
    connected: true,
    connecting: false,
    loadingMessages: true,
    chatId: currentChatId,
  });

  requestOldMessages();
};

const handleSocketMessage = (event: MessageEvent): void => {
  try {
    const data = JSON.parse(event.data);

    if (Array.isArray(data)) {
      if (data.length > 0) {
        const sortedMessages = data.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        store.setState(`chatMessagesById.${currentChatId}`, sortedMessages);
      } else {
        store.setState(`chatMessagesById.${currentChatId}`, []);
      }

      isRequestingMessages = false;
      store.setState('websocket', {
        connected: true,
        connecting: false,
        loadingMessages: false,
        chatId: currentChatId,
      });
    } else {
      if (currentChatId) {
        const chatId = String(currentChatId);
        const currentMessages = store.getState<ChatMessage[]>(`chatMessagesById.${chatId}`) || [];

        if (data.type === 'user connected') {
          const systemMessage: ChatMessage = {
            id: Date.now(),
            user_id: 0,
            chat_id: currentChatId,
            content: `Пользователь с ID: ${data.content} подключен`,
            time: new Date().toISOString(),
            type: 'message',
          };

          const newMessages = [...currentMessages, systemMessage];
          store.setState(`chatMessagesById.${chatId}`, newMessages);

          updateLastMessageInChatsList(systemMessage);

          return;
        }

        const messageWithChatId = {
          ...data,
          chat_id: currentChatId,
        };

        if (!currentMessages.some((msg) => msg.id === data.id)) {
          const newMessages = [...currentMessages, messageWithChatId];
          store.setState(`chatMessagesById.${chatId}`, newMessages);

          updateLastMessageInChatsList(messageWithChatId);
        } else {
          console.log(`Сообщение с ID ${data.id} уже существует`);
        }
      } else {
        console.log(`ИГНОРИРУЕМ сообщение: нет активного чата`);
      }
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения WebSocket:', error);
    isRequestingMessages = false;
    store.setState('websocket', {
      connected: true,
      connecting: false,
      loadingMessages: false,
      error: 'Ошибка обработки сообщения',
      chatId: currentChatId,
    });
  }
};

const handleSocketClose = (event: CloseEvent): void => {
  isRequestingMessages = false;
  store.setState('websocket', {
    connected: false,
    connecting: false,
    loadingMessages: false,
    chatId: null,
  });

  if (
    event.code !== 1000 &&
    reconnectAttempts < MAX_RECONNECT_ATTEMPTS &&
    currentChatId &&
    !isConnecting
  ) {
    setTimeout(() => {
      if (currentChatId && !isConnecting) {
        reconnectAttempts++;
        void connectToChat(currentChatId);
      }
    }, RECONNECT_DELAY);
  }
};

const handleSocketError = (error: Event): void => {
  console.error(`Ошибка WebSocket для чата ${currentChatId}:`, error);

  isRequestingMessages = false;
  store.setState('websocket', {
    connected: false,
    connecting: false,
    loadingMessages: false,
    error: 'Ошибка соединения',
  });
};

export const requestOldMessages = (): void => {
  if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
    isRequestingMessages = true;
    const message: WebSocketMessage = {
      content: '0',
      type: 'get old',
    };
    currentSocket.send(JSON.stringify(message));
  }
};

export const sendChatMessage = (content: string): void => {
  if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket не подключен');
    return;
  }

  if (!content.trim()) {
    console.error('Сообщение не может быть пустым');
    return;
  }

  const message: WebSocketMessage = {
    content: content.trim(),
    type: 'message',
  };

  currentSocket.send(JSON.stringify(message));
};

export const disconnectFromChat = (): void => {
  if (currentSocket) {
    currentSocket.close(1000, 'Пользователь покинул чат');
    currentSocket = null;
  }

  currentChatId = null;
  reconnectAttempts = 0;
  isConnecting = false;
  isRequestingMessages = false;
  connectionPromise = null;

  store.setState('websocket', {
    connected: false,
    connecting: false,
    loadingMessages: false,
    chatId: null,
  });
};

export const getConnectionStatus = () => {
  return (
    store.getState('websocket') || {
      connected: false,
      connecting: false,
      loadingMessages: false,
      chatId: null,
    }
  );
};

export const getCurrentChatId = (): number | null => {
  return currentChatId;
};

export const websocketService = {
  connectToChat,
  disconnectFromChat,
  sendMessage: sendChatMessage,
  requestOldMessages,
  getChatToken,
  getConnectionStatus,
  getCurrentChatId,
};
