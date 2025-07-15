import { createAvatar } from '@components';
import { BlockInstance } from '@models';
import { ChatsListInfo } from '@api';
import { createBlock } from '@framework';

const headerTemplate = `
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
`;

export const createConversationHeader = (currentChat: ChatsListInfo | undefined): BlockInstance => {
  const conversationAvatar = createAvatar({
    name: currentChat?.title || 'Чат',
  });

  return createBlock({
    ConversationAvatar: conversationAvatar,
    render: () => headerTemplate,
  });
};
