import { BlockInstance, ChatPageProps } from '@models';
import { ChatsListInfo, UserData } from '@api';
import { store } from '@store';
import { connectToChat, disconnectFromChat, fetchChats, getUserData } from '@services';
import { createCreateChatModal } from '@pages';
import { createBlock } from '@framework';
import { createAvatar, createButton, createDialogCard, createLink } from '@components';
import { ROUTE_URLS, router, ROUTES } from '@router';
import {
  cleanupManagers,
  createModalManager,
  getAvatarLink,
  useConversation,
  useStoreSubscription,
} from '@utils';

const template = `<main class="content-wrapper">
    <section class="chat-left-side">
        <section class="chat-profile">
            <article class="chat-profile-avatar">
                {{{ AvatarProfile }}}
                {{{ Link }}}
            </article>
            <div class="chat-create-chat-btn-wrapper">
                {{{ CreateChatButton }}}
            </div>
        </section>
        <section class="chat-messages">
            {{{ DialogCards }}}
        </section>
    </section>
    <section class="chat-right-side">
        {{#if hasConversation}}
            {{{ Conversation }}}
        {{else}}
            <div class="chat-plug">
                Выберите чат, чтобы отправить сообщение
            </div>
        {{/if}}
    </section>
    {{{ CreateChatModal }}}
</main>`;

const createAvatarProfile = () => {
  const user = store.getState<UserData>('user');
  return createAvatar({
    avatarImgLink: getAvatarLink(user?.avatar),
    name: user?.display_name || '',
  });
};

export const createChatPage = (params?: { id?: string }): BlockInstance => {
  if (params?.id) {
    const chatId = parseInt(params.id);
    store.setState('selectedChatId', chatId);
  }

  const initialChats = store.getState<ChatsListInfo[]>('chats') || [];
  const selectedPersonId = store.getState<number>('selectedChatId');
  const initialUser = store.getState<UserData>('user');

  const createChatModal = createCreateChatModal();

  const createChatButton = createButton({
    id: 'create-chat-button',
    size: 'medium',
    colorType: 'standard',
    text: 'Создать чат',
    onClick: () => createChatModal.showModal(),
  });

  const link = createLink({
    link: '/',
    id: 'link-profile-chats',
    text: 'Профиль',
    variant: 'secondary',
    size: 'standard-bold',
    rightElement:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    onClick: () => {
      store.setState('selectedChatId', null);
      disconnectFromChat();
      router.navigate(ROUTES.PROFILE);
    },
  });

  const createDialogCards = (chats: ChatsListInfo[]): BlockInstance[] => {
    return chats.map((chat) => {
      return createDialogCard(chat, () => {
        const newChatId = chat.id.toString();
        store.setState('selectedChatId', chat.id);
        router.navigate(ROUTE_URLS.CHAT_WITH_ID(newChatId));
      });
    });
  };

  const avatarProfile = createAvatarProfile();

  let updateConversation: () => void;
  let resetConversation: () => void;
  let unsubscribeFromStore: () => void;

  const modalManager = createModalManager();

  const chatInstance = createBlock<ChatPageProps>({
    hasChats: initialChats.length > 0,
    hasConversation: !!selectedPersonId,
    selectedPersonId: selectedPersonId ? selectedPersonId.toString() : null,
    chats: initialChats,
    chatUsers: [],
    DialogCards: createDialogCards(initialChats),
    Conversation: null,
    AvatarProfile: avatarProfile,
    CreateChatButton: createChatButton,
    CreateChatModal: createChatModal,
    Link: link,
    render: () => template,

    componentDidMount: (instance) => {
      const conversationHook = useConversation((conversation) => {
        const hasConversation = conversation !== null;
        instance.setProps({
          hasConversation,
          Conversation: conversation,
        });
      });

      updateConversation = conversationHook.updateConversation;
      resetConversation = conversationHook.resetConversation;

      const storeSubscription = useStoreSubscription(
        instance,
        updateConversation,
        createDialogCards,
        modalManager
      );

      unsubscribeFromStore = storeSubscription.subscribe();

      const initializeData = async () => {
        try {
          if (!initialUser) {
            await getUserData();
          }

          if (initialChats.length === 0) {
            await fetchChats();
          }
          const currentSelectedPersonId = store.getState<number>('selectedChatId');
          const currentUser = store.getState<UserData>('user');

          if (currentSelectedPersonId && currentUser?.id) {
            try {
              await connectToChat(currentSelectedPersonId);
            } catch (error) {
              console.error('Ошибка подключения к чату:', error);
            }
          }
        } catch (error) {
          console.error('Ошибка инициализации данных:', error);
        }
      };

      initializeData();

      updateConversation();
    },

    componentWillUnmount: () => {
      disconnectFromChat();
      if (unsubscribeFromStore) {
        unsubscribeFromStore();
      }
      cleanupManagers();
      if (resetConversation) {
        resetConversation();
      }
    },
  });

  return chatInstance;
};
