import { chatsApi } from '@api/chats';
import { store } from '@store';
import { ChatsListInfo } from '@api/chats/models';

export const fetchChats = async () => {
  const chats = await chatsApi.getChats();
  store.setState('chats', chats);
};

export const setChats = (chats: ChatsListInfo[]) => {
  store.setState('chats', chats);
};

export const loadChatUsers = async (chatId: string) => {
  try {
    const chatUsers = await chatsApi.getChatUsers(parseInt(chatId));
    store.setState('currentChatUsers', chatUsers);
  } catch (error) {
    console.error('Ошибка при загрузке пользователей чата:', error);
    store.setState('currentChatUsers', []);
  }
};
