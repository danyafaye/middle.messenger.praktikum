import { createInput, createModal } from '@components';
import { ModalInstance } from '@models';
import { chatsApi } from '@api';
import { loadChatUsers } from '@services';
import { createBlock } from '@framework';
import { modalManager } from '@utils/chatPage/managers/common';

const modalContentTemplate = `{{{ UserIdInput }}}`;

export const createAddUserModal = (chatId: string): ModalInstance => {
  const userIdInput = createInput({
    id: 'add-user-modal-input',
    name: 'userId',
    title: 'ID пользователя',
    placeholder: 'Введите ID пользователя',
    type: 'number',
  });

  const modalContent = createBlock({
    UserIdInput: userIdInput,
    render: () => modalContentTemplate,
  });

  return createModal({
    id: 'add-user-modal',
    title: 'Добавить пользователя',
    content: modalContent,
    buttonText: 'Добавить пользователя',
    buttonAction: async () => {
      const inputData = modalContent.getContent().querySelector('input') as HTMLInputElement;
      const userId = inputData?.value;

      if (userId && chatId) {
        try {
          await chatsApi.addUserToChat(parseInt(chatId), parseInt(userId));
          inputData.value = '';
          await loadChatUsers(chatId);

          const chatUsersModal = modalManager.getChatUsersModal(chatId);
          if (chatUsersModal) {
            chatUsersModal.updateUsers();
          }
        } catch (error) {
          console.error('Ошибка при добавлении пользователя:', error);
        }
      }
    },
  });
};
