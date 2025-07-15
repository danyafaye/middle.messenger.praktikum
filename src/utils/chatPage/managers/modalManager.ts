import { ChatUsersModalWithUpdate, ModalInstance } from '@models';

export const createModalManager = () => {
  const chatUsersModals = new Map<string, ChatUsersModalWithUpdate>();
  const addUserModals = new Map<string, ModalInstance>();
  const deleteUserModals = new Map<string, ModalInstance>();

  return {
    getChatUsersModal: (chatId: string) => chatUsersModals.get(chatId),
    setChatUsersModal: (chatId: string, modal: ChatUsersModalWithUpdate) => {
      chatUsersModals.set(chatId, modal);
    },

    getAddUserModal: (chatId: string) => addUserModals.get(chatId),
    setAddUserModal: (chatId: string, modal: ModalInstance) => {
      addUserModals.set(chatId, modal);
    },

    getDeleteUserModal: (chatId: string) => deleteUserModals.get(chatId),
    setDeleteUserModal: (chatId: string, modal: ModalInstance) => {
      deleteUserModals.set(chatId, modal);
    },

    removeChatModals: (chatId: string) => {
      chatUsersModals.delete(chatId);
      addUserModals.delete(chatId);
      deleteUserModals.delete(chatId);
    },

    clearAll: () => {
      chatUsersModals.clear();
      addUserModals.clear();
      deleteUserModals.clear();
    },

    // Статистика для дебага
    getStats: () => ({
      chatUsersCount: chatUsersModals.size,
      addUserCount: addUserModals.size,
      deleteUserCount: deleteUserModals.size,
    }),
  };
};
