import { createInput, createModal } from '@components';
import { ModalInstance } from '@models';
import { chatsApi } from '@api';
import { loadChatUsers } from '@services';
import { createBlock } from '@framework';
import { modalManager } from '@utils';

const modalContentTemplate = `{{{ UserIdInput }}}`;

export const createDeleteUserModal = (chatId: string): ModalInstance => {
  const userIdInput = createInput({
    id: 'delete-user-modal-input',
    name: 'userId',
    title: 'ID пользователя',
    placeholder: 'Введите ID пользователя для удаления',
    type: 'number',
  });

  const modalContent = createBlock({
    UserIdInput: userIdInput,
    render: () => modalContentTemplate,
  });

  return createModal({
    id: 'delete-user-modal',
    title: 'Удалить пользователя',
    content: modalContent,
    buttonText: 'Удалить пользователя',
    buttonAction: async () => {
      const inputData = modalContent.getContent().querySelector('input') as HTMLInputElement;
      const userId = inputData?.value;

      if (userId && chatId) {
        try {
          await chatsApi.removeUserFromChat(parseInt(chatId), parseInt(userId));
          inputData.value = '';
          await loadChatUsers(chatId);

          const chatUsersModal = modalManager.getChatUsersModal(chatId);
          if (chatUsersModal) {
            chatUsersModal.updateUsers();
          }
        } catch (error) {
          console.error('Ошибка при удалении пользователя:', error);
        }
      }
    },
  });
};
