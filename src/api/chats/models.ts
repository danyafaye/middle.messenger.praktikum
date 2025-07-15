import { UserData } from '@api';

export type ChatsListInfo = {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message: {
    user: Omit<UserData, 'id' | 'display_name'>;
    time: string;
    content: string;
  };
};

export type DeleteChatInfo = {
  userId: number;
  result: {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
  };
};

export type ChatUsersPayload = {
  users: number[];
  chatId: number;
};

export type ChatToken = {
  token: string;
};

export type ChatUser = Omit<UserData, 'phone' | 'email'> & {
  role: string;
};

export type ChatMessage = {
  id: number;
  user_id: number;
  chat_id: number;
  type: 'message';
  time: string;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
};

export type WebSocketMessage = {
  id?: number;
  type: 'get old' | 'message';
  content?: string;
};

export type WebSocketResponse = ChatMessage | ChatMessage[];
