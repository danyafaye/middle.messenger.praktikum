import { createBlock } from '@framework';
import { BlockInstance } from '@models';
import { ChatMessage, UserData } from '@api';
import { getMessageTime } from '@utils';

const messageTemplate = `
    <p class="conversation-message {{#if (fullCompare messageFrom 'you')}} conversation-message-right {{/if}} {{#if (fullCompare messageFrom 'system')}} conversation-message-system {{/if}}">
        <span class="conversation-message-text">{{ messageText }}</span>
        <span class="conversation-message-time">{{ messageTime }}</span>
    </p>
`;

export const createMessageBlocks = (
  chatMessages: ChatMessage[],
  userData: UserData | undefined
): BlockInstance[] => {
  return chatMessages.map((message) => {
    const isMyMessage = message.user_id === userData?.id;
    const isSystemMessage = message.user_id === 0;

    const messageTime = getMessageTime(message.time);

    return createBlock({
      messageFrom: isSystemMessage ? 'system' : isMyMessage ? 'you' : 'other',
      messageText: message.content,
      messageTime,
      render: () => messageTemplate,
    });
  });
};
