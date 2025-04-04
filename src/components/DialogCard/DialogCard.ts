import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './DialogCard.scss';
import { createAvatar, createCounter } from '@components';

type DialogCardProps = {
  message: string;
  unreadCount: number;
  personName: string;
  time: string;
  avatarImg?: string;
  onClick?: (e: Event) => void;
};

//language=hbs
const dialogCardTemplate: string = `
<section class="dialog-card">
  {{{ Avatar }}}
  <div class="dialog-card-info">
    <p class="dialog-card-time">{{ time }}</p>
    {{{ Counter }}}
  </div>
</section>
`;

export function createDialogCard(props: DialogCardProps): BlockInstance {
  const avatar = createAvatar({
    avatarImgLink: props.avatarImg,
    name: props.personName,
    avatarSize: 'big',
    message: props.message,
  });

  const counter = createCounter({
    count: props.unreadCount,
  });

  return createBlock({
    ...props,
    Avatar: avatar,
    Counter: props.unreadCount !== 0 ? counter : null,
    events: {
      click: (e: Event) => {
        if (props.onClick) {
          props.onClick(e);
        }
      },
    },
    render: () => dialogCardTemplate,
  });
}
