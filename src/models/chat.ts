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
