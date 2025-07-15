import { ChatMessage } from '@api';
import { WebSocketStatus } from '@models';

export const formatMessageTime = (timeString?: string): string => {
  if (!timeString) return '';
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(timeString);
  }
};

export const createMessagesHash = (messages: ChatMessage[]): string => {
  if (messages.length === 0) return '';
  const lastMessage = messages[messages.length - 1];
  return `${messages.length}-${lastMessage.id}-${lastMessage.content.slice(0, 10)}`;
};

export const getMessageTime = (time: string): string => {
  try {
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return 'Сейчас';
    }
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Сейчас';
  }
};

export const getLoadingText = (websocketStatus: WebSocketStatus | null, chatId: string): string => {
  if (!websocketStatus) {
    return 'Подключение...';
  }

  const isCurrentChatConnected = websocketStatus.chatId?.toString() === chatId;

  if (websocketStatus.error) {
    if (websocketStatus.error.includes('не авторизован')) {
      return 'Загрузка...';
    }
    return `Ошибка: ${websocketStatus.error}`;
  }

  if (!isCurrentChatConnected) {
    return 'Подключение к чату...';
  }

  if (websocketStatus.connecting) {
    return 'Подключение к чату...';
  }

  if (websocketStatus.loadingMessages) {
    return 'Загрузка сообщений...';
  }

  if (websocketStatus.connected && !websocketStatus.loadingMessages) {
    return 'В чате пока нет сообщений';
  }

  return 'Подключение...';
};
