import { createInput, createModal } from '@components';
import { ModalInstance } from '@models';
import { chatsApi } from '@api';
import { fetchChats } from '@services';
import { createBlock } from '@framework';

const modalContentTemplate = `{{{ ChatNameInput }}}`;

export const createCreateChatModal = (): ModalInstance => {
  const chatNameInput = createInput({
    id: 'create-chat-modal-input',
    name: 'createChat',
    title: 'Название чата',
    placeholder: 'Введите название чата',
  });

  const modalContent = createBlock({
    ChatNameInput: chatNameInput,
    render: () => modalContentTemplate,
  });

  return createModal({
    id: 'create-chat-modal',
    title: 'Создание чата',
    content: modalContent,
    buttonText: 'Создать чат',
    buttonAction: async () => {
      const inputData = modalContent.getContent().querySelector('input') as HTMLInputElement;
      const title = inputData?.value;

      if (title) {
        try {
          await chatsApi.createChat(title);
          inputData.value = '';
          await fetchChats();
        } catch (error) {
          console.error('Ошибка при создании чата', error);
        }
      }
    },
  });
};
