/**
 * Custom hook for managing chat state
 * Provides chat data and actions for the ChatGPT clone
 */

import { useState, useCallback } from 'react';
import { getChats, getActiveChat, getChatById, type Chat } from '@/data/mock-chats';

export interface UseChatReturn {
  chats: Chat[];
  activeChat: Chat | undefined;
  selectChat: (chatId: string) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  isLoading: boolean;
}

export function useChat(): UseChatReturn {
  const [chats, setChats] = useState<Chat[]>(getChats());
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = getActiveChat();

  const selectChat = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => ({
        ...chat,
        isActive: chat.id === chatId
      }))
    );
  }, []);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New chat',
      messages: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prevChats => [
      newChat,
      ...prevChats.map(chat => ({ ...chat, isActive: false }))
    ]);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prevChats => {
      const filteredChats = prevChats.filter(chat => chat.id !== chatId);
      
      // If we deleted the active chat, make the first remaining chat active
      if (filteredChats.length > 0 && !filteredChats.some(chat => chat.isActive)) {
        filteredChats[0] = { ...filteredChats[0], isActive: true };
      }
      
      return filteredChats;
    });
  }, []);

  return {
    chats,
    activeChat,
    selectChat,
    createNewChat,
    deleteChat,
    isLoading,
  };
}
