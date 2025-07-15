import { BlockInstance } from '@models';
import { createBlock } from '@framework';
import { createAvatar, createCounter } from '@components';
import { ChatsListInfo } from '@api';
import { formatMessageTime, getAvatarLink } from '@utils';

import './DialogCard.scss';

const dialogCardTemplate: string = `
<section class="dialog-card">
  {{{ Avatar }}}
  <div class="dialog-card-info">
    <p class="dialog-card-time">{{ time }}</p>
    {{{ Counter }}}
  </div>
</section>
`;

export const createDialogCard = (chat: ChatsListInfo, onClick: () => void): BlockInstance => {
  const message = chat.last_message?.content || 'Нет сообщений';
  const time = formatMessageTime(chat.last_message?.time);
  const avatarImg = getAvatarLink(chat.avatar);

  const avatar = createAvatar({
    avatarImgLink: avatarImg,
    name: chat.title,
    avatarSize: 'big',
    message: message,
  });

  const counter = createCounter({
    count: chat.unread_count,
  });

  return createBlock({
    message,
    unreadCount: chat.unread_count,
    personName: chat.title,
    time,
    avatarImg,
    Avatar: avatar,
    Counter: chat.unread_count !== 0 ? counter : null,
    events: {
      click: onClick || (() => {}),
    },
    render: () => dialogCardTemplate,
  });
};
