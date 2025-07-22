import { Chat } from '../types/chat';

const STORAGE_KEY = 'chatgpt-clone-chats';

export const loadChatsFromStorage = (): Chat[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chats from storage:', error);
    return [];
  }
};

export const saveChatsToStorage = (chats: Chat[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to storage:', error);
  }
};

export const generateChatTitle = (firstMessage: string): string => {
  // Generate a title from the first message (max 50 characters)
  const title = firstMessage.slice(0, 50);
  return title.length < firstMessage.length ? title + '...' : title;
};