import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Chat, Message, ChatContextType } from '../types/chat';
import { loadChatsFromStorage, saveChatsToStorage, generateChatTitle } from '../utils/storage';
import { sendMessageToOpenAI } from '../utils/openai';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chats from storage on mount
  useEffect(() => {
    const loadedChats = loadChatsFromStorage();
    setChats(loadedChats);
    if (loadedChats.length > 0) {
      setCurrentChat(loadedChats[0]);
    }
  }, []);

  // Save chats to storage whenever chats change
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentChat(newChat);
    setChats((prev) => [newChat, ...prev]);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const updateChat = (updatedChat: Chat) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
    setCurrentChat(updatedChat);
  };

  const addMessage = async (message: Message) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, message],
      updatedAt: Date.now(),
    };

    // Update title if this is the first user message
    if (currentChat.messages.length === 0 && message.role === 'user') {
      updatedChat.title = generateChatTitle(message.content);
    }

    updateChat(updatedChat);

    // If it's a user message, get AI response
    if (message.role === 'user') {
      setIsLoading(true);
      try {
        const response = await sendMessageToOpenAI(updatedChat.messages);
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };

        const finalChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, assistantMessage],
          updatedAt: Date.now(),
        };

        updateChat(finalChat);
      } catch (error) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now(),
        };

        const errorChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, errorMessage],
          updatedAt: Date.now(),
        };

        updateChat(errorChat);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearCurrentChat = () => {
    if (!currentChat) return;

    const clearedChat: Chat = {
      ...currentChat,
      messages: [],
      title: 'New Chat',
      updatedAt: Date.now(),
    };

    updateChat(clearedChat);
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChat(null);
  };

  const regenerateResponse = async () => {
    if (!currentChat || currentChat.messages.length === 0) return;

    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    // Remove the last assistant message
    const messagesWithoutLast = currentChat.messages.slice(0, -1);
    const updatedChat = {
      ...currentChat,
      messages: messagesWithoutLast,
      updatedAt: Date.now(),
    };

    updateChat(updatedChat);

    // Generate new response
    setIsLoading(true);
    try {
      const response = await sendMessageToOpenAI(messagesWithoutLast);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: Date.now(),
      };

      updateChat(finalChat);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      };

      const errorChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
        updatedAt: Date.now(),
      };

      updateChat(errorChat);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: ChatContextType = {
    chats,
    currentChat,
    createNewChat,
    selectChat,
    addMessage,
    clearCurrentChat,
    clearAllChats,
    regenerateResponse,
    isLoading,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};