export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  addMessage: (message: Message) => void;
  clearCurrentChat: () => void;
  clearAllChats: () => void;
  regenerateResponse: () => void;
  isLoading: boolean;
}