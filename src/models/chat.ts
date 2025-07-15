import { BlockInstance, BlockProps, ModalInstance } from '@models';
import { ChatsListInfo, ChatUser } from '@api';

export type DialogType = {
  id: string;
  personName: string;
  message: string;
  time: string;
  unreadCount: number;
};

export type MessageType = {
  text: string;
  time: string;
  from: string;
};

export type ConversationType = {
  id: string;
  messages: MessageType[];
};

export type WebSocketStatus = {
  connected: boolean;
  connecting: boolean;
  loadingMessages: boolean;
  chatId: number | null;
  error?: string;
};

export type ConversationState = {
  chatId: string | null;
  messagesCount: number;
  messagesHash: string;
  websocketConnected: boolean;
  websocketLoading: boolean;
};

export type ChatUsersModalWithUpdate = ModalInstance & {
  updateUsers: () => void;
};

export type ChatPageProps = {
  hasChats: boolean;
  hasConversation: boolean;
  selectedPersonId: string | null;
  chats: ChatsListInfo[];
  chatUsers: ChatUser[];
  DialogCards: BlockInstance[];
  Conversation: BlockInstance | null;
  AvatarProfile: BlockInstance | null;
  CreateChatButton: BlockInstance;
  CreateChatModal: ModalInstance;
  Link: BlockInstance;
} & BlockProps;
