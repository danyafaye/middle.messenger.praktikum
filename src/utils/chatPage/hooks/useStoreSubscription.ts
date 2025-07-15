import { BlockInstance } from '@models';
import { ChatsListInfo, ChatUser, UserData } from '@api';
import { store } from '@store';
import { connectToChat } from '@services';
import { createModalManager, getAvatarLink } from '@utils';
import { createAvatar } from '@components';

export const useStoreSubscription = (
  chatInstance: BlockInstance,
  updateConversation: () => void,
  createDialogCards: (chats: ChatsListInfo[]) => BlockInstance[],
  modalManager: ReturnType<typeof createModalManager>
) => {
  const connectToChatSafely = async (chatId: number): Promise<void> => {
    const userData = store.getState<UserData>('user');
    if (userData?.id) {
      try {
        await connectToChat(chatId);
      } catch (error) {
        console.error('Ошибка подключения к чату:', error);
      }
    }
  };

  const createAvatarProfile = () => {
    const user = store.getState<UserData>('user');
    return createAvatar({
      avatarImgLink: getAvatarLink(user?.avatar),
      name: user?.display_name || '',
    });
  };

  const handleStoreUpdate = (path: string, value: unknown) => {
    switch (true) {
      case path.startsWith('chatMessagesById.'): {
        const changedChatId = path.replace('chatMessagesById.', '');
        const currentChatId = store.getState<number>('selectedChatId');

        if (currentChatId && changedChatId === String(currentChatId)) {
          updateConversation();
        }
        break;
      }

      case path === 'chats': {
        const newChats = value as ChatsListInfo[];
        const newDialogCards = createDialogCards(newChats);
        chatInstance.setLists({ DialogCards: newDialogCards });
        chatInstance.setProps({
          chats: newChats,
          hasChats: newChats.length > 0,
        });
        break;
      }

      case path === 'selectedChatId': {
        const newSelectedChatId = value ? String(value) : null;
        chatInstance.setProps({
          selectedPersonId: newSelectedChatId,
          hasConversation: !!newSelectedChatId,
        });
        updateConversation();
        break;
      }

      case path === 'websocket': {
        updateConversation();
        break;
      }

      case path === 'currentChatUsers': {
        const newChatUsers = value as ChatUser[];
        chatInstance.setProps({ chatUsers: newChatUsers });

        const currentChatId = store.getState<number>('selectedChatId');
        if (currentChatId) {
          const chatUsersModal = modalManager.getChatUsersModal(currentChatId.toString());
          if (chatUsersModal) {
            chatUsersModal.updateUsers();
          }
        }
        break;
      }

      case path === 'user': {
        const userData = value as UserData;
        const newAvatarProfile = createAvatarProfile();
        chatInstance.setProps({ AvatarProfile: newAvatarProfile });

        const currentSelectedChatId = store.getState<number>('selectedChatId');
        if (currentSelectedChatId && userData?.id) {
          connectToChatSafely(currentSelectedChatId);
        }
        break;
      }
    }
  };

  return {
    subscribe: () => {
      store.subscribe(handleStoreUpdate);
      return () => store.unsubscribe(handleStoreUpdate);
    },
    connectToChatSafely,
  };
};
