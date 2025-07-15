import { createButton, createInput } from '@components';
import { BlockInstance } from '@models';
import { bindFieldValidation } from '@utils';
import { sendChatMessage } from '@services';
import { createBlock } from '@framework';

const formTemplate = `
    <form class="conversation-chat" method="post">
        {{{ MessageInput }}}
        {{{ MessageButtonSend }}}
    </form>
`;

export const createConversationForm = (): BlockInstance => {
  const messageButtonSend = createButton({
    id: 'message-form-button',
    element: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    colorType: 'blue',
    size: 'icon',
    type: 'submit',
  });

  const messageInput = createInput({
    name: 'message',
    id: 'conversation-form-message',
    placeholder: 'Введите сообщение...',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });

  return createBlock({
    MessageButtonSend: messageButtonSend,
    MessageInput: messageInput,
    events: {
      submit: async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const messageInput = form.querySelector('input[name="message"]') as HTMLInputElement;

        if (messageInput && messageInput.value.trim()) {
          const message = messageInput.value.trim();
          sendChatMessage(message);
          messageInput.value = '';
        }
      },
    },
    render: () => formTemplate,
  });
};
