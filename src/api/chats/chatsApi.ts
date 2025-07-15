import {
  API_ENDPOINTS,
  baseApi,
  ChatsListInfo,
  ChatToken,
  ChatUser,
  ChatUsersPayload,
  DeleteChatInfo,
} from '@api';

export const chatsApi = {
  getChats: () => baseApi.get<ChatsListInfo[]>(API_ENDPOINTS.CHATS),
  createChat: (title: string) =>
    baseApi.post<{ title: string }, { id: string }>(API_ENDPOINTS.CHATS, { title }),
  deleteChat: (chatId: number) =>
    baseApi.delete<{ chatId: number }, DeleteChatInfo>(`${API_ENDPOINTS.CHATS}`, { chatId }),
  addUserToChat: (chatId: number, userId: number) =>
    baseApi.put<ChatUsersPayload, string>(API_ENDPOINTS.CHAT_USERS, { users: [userId], chatId }),
  removeUserFromChat: (chatId: number, userId: number) =>
    baseApi.delete<ChatUsersPayload, string>(API_ENDPOINTS.CHAT_USERS, {
      users: [userId],
      chatId,
    }),
  getChatToken: (chatId: number) =>
    baseApi.post<number, ChatToken>(API_ENDPOINTS.CHAT_TOKEN(chatId)),
  getChatUsers: (chatId: number) => baseApi.get<ChatUser[]>(API_ENDPOINTS.GET_CHAT_USERS(chatId)),
};
