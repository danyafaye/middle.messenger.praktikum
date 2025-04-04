import { BlockInstance } from '@models';
import { createBlock } from '@framework';
import {
  createAvatar,
  createButton,
  createDialogCard,
  createH1,
  createInput,
  createLink,
} from '@components';
import { bindFieldValidation, bindFormSubmit, navigateTo } from '@utils';
import { conversations, mockData } from '@pages/ChatPage/data/mockData';

//language=hbs
const template = `<main class="content-wrapper">
    <section class="chat-left-side">
        <section class="chat-profile">
            <article class="chat-profile-avatar">
              {{{ AvatarProfile }}}
              {{{ Link }}}
            </article>
            {{{ InputSearch }}}
        </section>
        <section class="chat-messages">
          {{{ DialogCards }}}
        </section>
    </section>
    <section class="chat-right-side">
    {{#if selectedPersonId}}
      {{{ Conversation }}}
    {{else}}
      <div class="chat-plug">
        Выберите чат, чтобы отправить сообщение
      </div>
    {{/if}}
    </section>
</main>`;

//language=hbs
const conversationTemplate = `<section class="conversation">
  <header class="conversation-header">
    {{{ ConversationAvatar }}}
    <div class="conversation-header-actions">
      <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 7C12.1533 7 11.581 6.76295 11.159 6.34099C10.7371 5.91903 10.5 5.34674 10.5 4.75C10.5 4.15326 10.7371 3.58097 11.159 3.15901C11.581 2.73705 12.1533 2.5 12.75 2.5C13.3467 2.5 13.919 2.73705 14.341 3.15901C14.7629 3.58097 15 4.15326 15 4.75C15 5.34674 14.7629 5.91903 14.341 6.34099C13.919 6.76295 13.3467 7 12.75 7ZM12.75 15.25C12.1533 15.25 11.581 15.0129 11.159 14.591C10.7371 14.169 10.5 13.5967 10.5 13C10.5 12.4033 10.7371 11.831 11.159 11.409C11.581 10.9871 12.1533 10.75 12.75 10.75C13.3467 10.75 13.919 10.9871 14.341 11.409C14.7629 11.831 15 12.4033 15 13C15 13.5967 14.7629 14.169 14.341 14.591C13.919 15.0129 13.3467 15.25 12.75 15.25ZM10.5 21.25C10.5 21.8467 10.7371 22.419 11.159 22.841C11.581 23.2629 12.1533 23.5 12.75 23.5C13.3467 23.5 13.919 23.2629 14.341 22.841C14.7629 22.419 15 21.8467 15 21.25C15 20.6533 14.7629 20.081 14.341 19.659C13.919 19.2371 13.3467 19 12.75 19C12.1533 19 11.581 19.2371 11.159 19.659C10.7371 20.081 10.5 20.6533 10.5 21.25Z" fill="white"/>
      </svg>
    </div>
  </header>
  <section class="conversation-messages">
      {{#if Messages}}
      <div class="conversation-messages-wrapper">
      {{{ Messages }}}
      </div>
      {{else}}
        <div class="chat-plug">Тут пока пусто!</div>
      {{/if}}
  </section>
    <form class="conversation-chat" method="post">
      {{{ MessageButtonAction }}}
      {{{ MessageInput }}}
      {{{ MessageButtonSend }}}
    </form>
</section>`;

//language=hbs
const messageTemplate = `
  <p class="conversation-message {{#if (fullCompare messageFrom 'you')}} conversation-message-right {{/if}}"> 
    <span class="conversation-message-text">{{ messageText }}</span>
    <span class="conversation-message-time">{{ messageTime }}</span>
  </p>
`;

export const createChatPage = (): BlockInstance => {
  const getSelectedPersonId = (): string | null => {
    const path = window.location.pathname;
    const match = path.match(/^\/chat\/(\d+)$/);
    return match ? match[1] : null;
  };

  const createConversationBlock = (personId: string | null) => {
    if (!personId) return null;
    const conversationInfo = conversations.find((conversation) => conversation.id === personId);
    const personInfo = mockData.find((person) => person.id === personId);
    if (!personInfo) return null;
    const conversationAvatar = createAvatar({
      name: personInfo.personName,
    });
    const messageButtonSend = createButton({
      id: 'message-form-button',
      element: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      colorType: 'blue',
      size: 'icon',
      type: 'submit',
    });
    const messageButtonAction = createButton({
      id: 'message-action-button',
      element: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.44 11.0499L12.25 20.2399C11.1242 21.3658 9.59723 21.9983 8.00505 21.9983C6.41286 21.9983 4.88589 21.3658 3.76005 20.2399C2.6342 19.1141 2.00171 17.5871 2.00171 15.9949C2.00171 14.4027 2.6342 12.8758 3.76005 11.7499L12.95 2.55992C13.7006 1.80936 14.7186 1.3877 15.78 1.3877C16.8415 1.3877 17.8595 1.80936 18.61 2.55992C19.3606 3.31048 19.7823 4.32846 19.7823 5.38992C19.7823 6.45138 19.3606 7.46936 18.61 8.21992L9.41005 17.4099C9.03476 17.7852 8.52577 17.996 7.99505 17.996C7.46432 17.996 6.95533 17.7852 6.58005 17.4099C6.20476 17.0346 5.99393 16.5256 5.99393 15.9949C5.99393 15.4642 6.20476 14.9552 6.58005 14.5799L15.07 6.09992" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      size: 'icon',
      colorType: 'transparent',
      onClick: (e) => {
        e.preventDefault();
      },
    });
    const messageInput = createInput({
      name: 'message',
      id: 'conversation-form-message',
      placeholder: 'Введите сообщение...',
    });
    return createBlock({
      Messages:
        conversationInfo &&
        conversationInfo.messages.map((message) =>
          createBlock({
            messageFrom: message.from,
            messageText: message.text,
            messageTime: message.time,
            render: () => messageTemplate,
          })
        ),
      ConversationAvatar: conversationAvatar,
      MessageButtonSend: messageButtonSend,
      MessageButtonAction: messageButtonAction,
      MessageInput: messageInput,
      render: () => conversationTemplate,
      afterRender: (block: BlockInstance) => {
        const content = block.getContent();
        const msgContainer = content.querySelector('.conversation-messages') as HTMLElement;
        if (msgContainer) {
          requestAnimationFrame(() => {
            msgContainer.scrollTop = msgContainer.scrollHeight;
          });
        }
        const form = content.querySelector('form');
        const inputs = content.querySelectorAll('input');
        inputs.forEach((input) => {
          bindFieldValidation(input as HTMLInputElement);
        });
        if (form) {
          bindFormSubmit(form);
        }
      },
    });
  };

  const initialSelectedId = getSelectedPersonId();
  const initialConversation = createConversationBlock(initialSelectedId);

  const h1 = createH1({
    text: 'CHAT PLUG',
  });
  const inputSearch = createInput({
    name: 'search-value',
    id: 'input-search-value',
    placeholder: 'Поиск',
  });
  const link = createLink({
    link: '/',
    id: 'link-profile-chats',
    text: 'Профиль',
    variant: 'secondary',
    size: 'standard-bold',
    rightElement:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    onClick: (e) => {
      navigateTo(e, '/profile');
    },
  });
  const avatarProfile = createAvatar({
    name: 'Данила',
  });

  const dialogCards = mockData.map((data) => {
    return createDialogCard({
      personName: data.personName,
      unreadCount: data.unreadCount,
      message: data.message,
      time: data.time,
      onClick: (e) => {
        navigateTo(e, `/chat/${data.id}`);
      },
    });
  });

  const chatMessagesEl = document.querySelector('.chat-messages');
  if (chatMessagesEl) {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  return createBlock({
    selectedPersonId: initialSelectedId,
    H1: h1,
    InputSearch: inputSearch,
    Link: link,
    AvatarProfile: avatarProfile,
    DialogCards: dialogCards,
    Conversation: initialConversation,
    render: () => template,
    componentDidMount: (block: BlockInstance) => {
      const updateConversation = () => {
        const newId = getSelectedPersonId();
        const newConversation = createConversationBlock(newId);
        block.setProps({
          selectedPersonId: newId,
          Conversation: newConversation,
        });
      };
      window.addEventListener('popstate', updateConversation);
      updateConversation();
    },
  });
};
