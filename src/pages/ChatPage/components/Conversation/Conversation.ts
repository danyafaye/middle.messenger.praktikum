import { createBlock } from '@framework';
import { BlockInstance, WebSocketStatus } from '@models';
import { ChatsListInfo, UserData } from '@api';
import { createAvatar } from '@components';
import {
  createAddUserModal,
  createChatUsersModal,
  createConversationForm,
  createDeleteUserModal,
  createMessageBlocks,
} from '@pages';
import { loadChatUsers } from '@services';
import { getChatMessages, getLoadingText, modalManager, scrollManager } from '@utils';

const conversationTemplate = `<section class="conversation">
    <header class="conversation-header">
        {{{ ConversationAvatar }}}
        <div class="conversation-header-actions">
            <svg class="add-user-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1.75V1H7.25V6.75H1.5V8.25H7.25V14H8.75V8.25H14.5V6.75H8.75V1.75Z" fill="currentColor"/>
            </svg>
            <svg class="remove-user-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 7.25H14V8.75H2V7.25Z" fill="currentColor"/>
            </svg>
        </div>
    </header>
    <section class="conversation-messages">
        {{#if hasMessages}}
            <div class="conversation-messages-wrapper">
                {{{ Messages }}}
            </div>
        {{else}}
            <div class="chat-plug">{{loadingText}}</div>
        {{/if}}
    </section>
    {{{ Form }}}
    {{{ ChatUsersModal }}}
    {{{ AddUserModal }}}
    {{{ DeleteUserModal }}}
</section>`;

export const createConversationBlock = (
  chatId: string,
  userData: UserData | undefined,
  currentChats: ChatsListInfo[],
  websocketStatus: WebSocketStatus,
  isInitialLoad: boolean
): BlockInstance => {
  const currentChat = currentChats.find((chat) => chat.id === parseInt(chatId));
  const chatMessages = getChatMessages(chatId);
  const hasMessages = chatMessages.length > 0;

  let chatUsersModal = modalManager.getChatUsersModal(chatId);
  let addUserModal = modalManager.getAddUserModal(chatId);
  let deleteUserModal = modalManager.getDeleteUserModal(chatId);

  if (!chatUsersModal) {
    chatUsersModal = createChatUsersModal();
    modalManager.setChatUsersModal(chatId, chatUsersModal);
  }

  if (!addUserModal) {
    addUserModal = createAddUserModal(chatId);
    modalManager.setAddUserModal(chatId, addUserModal);
  }

  if (!deleteUserModal) {
    deleteUserModal = createDeleteUserModal(chatId);
    modalManager.setDeleteUserModal(chatId, deleteUserModal);
  }

  const conversationAvatar = createAvatar({
    name: currentChat?.title || 'Чат',
  });

  const formBlock = createConversationForm();
  const messageBlocks = createMessageBlocks(chatMessages, userData);

  const loadingText = getLoadingText(websocketStatus, chatId);

  const conversationBlock = createBlock({
    Messages: messageBlocks,
    hasMessages,
    loadingText,
    ConversationAvatar: conversationAvatar,
    Form: formBlock,
    ChatUsersModal: chatUsersModal,
    AddUserModal: addUserModal,
    DeleteUserModal: deleteUserModal,
    render: () => conversationTemplate,

    componentDidMount: (instance: BlockInstance) => {
      if (hasMessages) {
        const setupScrolling = () => {
          const content = instance.getContent();
          const msgContainer = content.querySelector('.conversation-messages') as HTMLElement;

          if (msgContainer) {
            const wasAtBottom = scrollManager.getScrollPosition(chatId) !== false;

            if (isInitialLoad || wasAtBottom) {
              msgContainer.scrollTop = msgContainer.scrollHeight;
              scrollManager.setScrollPosition(chatId, true);
            }

            const handleScroll = () => {
              const isAtBottom =
                msgContainer.scrollHeight - msgContainer.scrollTop - msgContainer.clientHeight <=
                50;
              scrollManager.setScrollPosition(chatId, isAtBottom);
            };

            msgContainer.removeEventListener('scroll', handleScroll);
            msgContainer.addEventListener('scroll', handleScroll, { passive: true });
          }
        };

        setTimeout(setupScrolling, 10);
      }
    },

    afterRender: (instance: BlockInstance) => {
      if (hasMessages) {
        const content = instance.getContent();
        const msgContainer = content.querySelector('.conversation-messages') as HTMLElement;

        if (msgContainer) {
          const wasAtBottom = scrollManager.getScrollPosition(chatId) !== false;

          if (wasAtBottom) {
            setTimeout(() => {
              msgContainer.scrollTop = msgContainer.scrollHeight;
              scrollManager.setScrollPosition(chatId, true);
            }, 10);
          }
        }
      }
    },

    events: {
      click: (e: Event) => {
        const target = e.target as HTMLElement;

        if (target.closest('.add-user-icon')) {
          e.stopPropagation();
          loadChatUsers(chatId).then(() => {
            chatUsersModal.updateUsers();
            addUserModal.showModal();
          });
          return;
        }

        if (target.closest('.remove-user-icon')) {
          e.stopPropagation();
          loadChatUsers(chatId).then(() => {
            chatUsersModal.updateUsers();
            deleteUserModal.showModal();
          });
          return;
        }

        if (target.closest('.conversation-header')) {
          loadChatUsers(chatId).then(() => {
            chatUsersModal.updateUsers();
            chatUsersModal.showModal();
          });
          return;
        }
      },
    },
  });

  return conversationBlock;
};
