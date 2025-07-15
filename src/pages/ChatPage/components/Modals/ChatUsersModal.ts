import { createModal } from '@components';
import { ChatUser } from '@api';
import { store } from '@store';
import { createBlock } from '@framework';
import { getAvatarLink } from '@utils';
import { ChatUsersModalWithUpdate } from '@models';

const modalContentTemplate = `
  <div class="chat-user-list">
      {{#if hasUsers}}
          {{{ UserItems }}}
      {{else}}
          <div class="chat-users-plug">
              В чате нет участников
          </div>
      {{/if}}
  </div>
`;

const userItemTemplate = `
  <section class="chat-user-item">
    <div class="chat-user-main">
      <img src="{{avatarUrl}}" alt="{{display_name}}" class="chat-user-avatar" />
      <span class="chat-user-name">{{display_name}}</span>
    </div>
  </section>
`;

export const createChatUsersModal = (): ChatUsersModalWithUpdate => {
  const getCurrentUsers = () => {
    const chatUsers = store.getState<ChatUser[]>('currentChatUsers') || [];
    return chatUsers.map((user) => ({
      ...user,
      avatarUrl: getAvatarLink(user.avatar),
    }));
  };

  const createUserBlocks = (users: ReturnType<typeof getCurrentUsers>) => {
    return users.map((user) => {
      return createBlock({
        display_name: user.display_name,
        avatarUrl: user.avatarUrl,
        id: user.id,
        render: () => userItemTemplate,
      });
    });
  };

  const initialUsers = getCurrentUsers();
  const initialUserBlocks = createUserBlocks(initialUsers);

  const modalContent = createBlock({
    hasUsers: initialUsers.length > 0,
    UserItems: initialUserBlocks,
    render: () => modalContentTemplate,
  });

  const modal = createModal({
    id: 'chat-users-modal',
    title: 'Участники чата',
    content: modalContent,
    buttonText: 'Закрыть',
    buttonAction: () => {},
  });

  const updateUsers = (): void => {
    const updatedUsers = getCurrentUsers();
    const updatedUserBlocks = createUserBlocks(updatedUsers);
    const hasUsers = updatedUsers.length > 0;

    modalContent.setProps({ hasUsers });
    modalContent.setLists({ UserItems: updatedUserBlocks });
  };

  return {
    ...modal,
    updateUsers,
  };
};
