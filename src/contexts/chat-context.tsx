'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message, Chat, Attachment } from '@/types';
import { prepareMessagesForAPI, getContextStats } from '@/lib/chat/context-manager';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  isLoadingChats: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: { id: string; updates: Partial<Chat> } }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_CHATS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  isLoading: false,
  isLoadingChats: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    
    case 'ADD_CHAT':
      return { 
        ...state, 
        chats: [action.payload, ...state.chats],
        activeChat: action.payload 
      };
    
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id
            ? { ...chat, ...action.payload.updates }
            : chat
        ),
        activeChat: state.activeChat?.id === action.payload.id
          ? { ...state.activeChat, ...action.payload.updates }
          : state.activeChat
      };
    
    case 'DELETE_CHAT':
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload);
      return {
        ...state,
        chats: filteredChats,
        activeChat: state.activeChat?.id === action.payload
          ? (filteredChats[0] || null)
          : state.activeChat
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? { 
                ...chat, 
                messages: [...chat.messages, action.payload.message],
                updatedAt: new Date()
              }
            : chat
        ),
        activeChat: state.activeChat?.id === action.payload.chatId
          ? {
              ...state.activeChat,
              messages: [...state.activeChat.messages, action.payload.message],
              updatedAt: new Date()
            }
          : state.activeChat
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === action.payload.messageId
                    ? { ...msg, ...action.payload.updates }
                    : msg
                )
              }
            : chat
        ),
        activeChat: state.activeChat?.id === action.payload.chatId
          ? {
              ...state.activeChat,
              messages: state.activeChat.messages.map(msg =>
                msg.id === action.payload.messageId
                  ? { ...msg, ...action.payload.updates }
                  : msg
              )
            }
          : state.activeChat
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_LOADING_CHATS':
      return { ...state, isLoadingChats: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

interface ChatContextType extends ChatState {
  createNewChat: () => Promise<Chat>;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  updateMessage: (messageId: string, content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isLoaded } = useUser();

  // Load chats from API when user is authenticated
  useEffect(() => {
    if (!isLoaded || !user) {
      // Clear chats if user is not authenticated
      if (isLoaded && !user) {
        dispatch({ type: 'SET_CHATS', payload: [] });
        dispatch({ type: 'SET_ACTIVE_CHAT', payload: null });
      }
      return;
    }

    const loadChats = async () => {
      try {
        dispatch({ type: 'SET_LOADING_CHATS', payload: true });
        const response = await fetch('/api/chats');

        if (response.ok) {
          const data = await response.json();

          const chats = data.chats.map((chat: {
            id: string;
            title: string;
            createdAt: string;
            updatedAt: string;
            messages: Array<{ id: string; role: string; content: string; timestamp: string }>
          }) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: chat.messages.map((msg: { id: string; role: string; content: string; timestamp: string }) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));

          dispatch({ type: 'SET_CHATS', payload: chats });

          // Set first chat as active if no active chat
          if (chats.length > 0) {
            dispatch({ type: 'SET_ACTIVE_CHAT', payload: chats[0] });
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to load chats:', response.status, errorData);
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        dispatch({ type: 'SET_LOADING_CHATS', payload: false });
      }
    };

    loadChats();
  }, [isLoaded, user]);

  const createNewChat = useCallback(async (): Promise<Chat> => {
    // Create optimistic chat immediately for better UX
    const optimisticChat: Chat = {
      id: `temp-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add optimistic chat immediately
    dispatch({ type: 'ADD_CHAT', payload: optimisticChat });
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: optimisticChat });

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChat = {
          ...data.chat,
          createdAt: new Date(data.chat.createdAt),
          updatedAt: new Date(data.chat.updatedAt),
          messages: data.chat.messages.map((msg: { id: string; role: string; content: string; timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };

        // Replace optimistic chat with real chat
        dispatch({ type: 'DELETE_CHAT', payload: optimisticChat.id });
        dispatch({ type: 'ADD_CHAT', payload: newChat });
        dispatch({ type: 'SET_ACTIVE_CHAT', payload: newChat });
        return newChat;
      } else {
        throw new Error('Failed to create chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      // Keep the optimistic chat as fallback, just update the ID
      const fallbackChat: Chat = {
        ...optimisticChat,
        id: `chat-${Date.now()}` // Give it a proper ID
      };

      // Replace temp chat with fallback chat
      dispatch({ type: 'DELETE_CHAT', payload: optimisticChat.id });
      dispatch({ type: 'ADD_CHAT', payload: fallbackChat });
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: fallbackChat });

      return fallbackChat;
    }
  }, []);

  const selectChat = useCallback((chatId: string) => {
    const chat = state.chats.find(c => c.id === chatId);
    if (chat) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
    }
  }, [state.chats]);

  const deleteChat = useCallback((chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  }, []);

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    dispatch({
      type: 'UPDATE_CHAT',
      payload: { id: chatId, updates: { title, updatedAt: new Date() } }
    });

    // Save title to database
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title
        }),
      });
    } catch (error) {
      console.error('Failed to update chat title in database:', error);
    }
  }, []);

  const sendMessage = useCallback(async (content: string, attachments: Attachment[] = []) => {
    let currentChat = state.activeChat;

    if (!currentChat) {
      // Create new chat if none exists
      currentChat = await createNewChat();
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: currentChat });
    }
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      ...(attachments.length > 0 && { attachments }),
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { chatId: currentChat.id, message: userMessage }
    });

    // Save user message to database
    try {
      await fetch(`/api/chats/${currentChat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentChat.messages, userMessage]
        }),
      });
    } catch (error) {
      console.error('Failed to save user message:', error);
    }

    // Generate title from first message
    if (currentChat.messages.length === 0) {
      const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
      await updateChatTitle(currentChat.id, title);
    }

    // Add assistant message placeholder
    const assistantMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    };

    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { chatId: currentChat.id, message: assistantMessage } 
    });

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Prepare messages for API with context management
      const allMessages = [...currentChat.messages, userMessage];
      const messagesForAPI = await prepareMessagesForAPI(
        allMessages,
        undefined, // No system prompt for now
        {
          maxTokens: 4000,
          reserveTokensForResponse: 1000,
          model: 'gpt-3.5-turbo',
        }
      );

      // Log context stats for debugging
      const stats = getContextStats(allMessages);
      console.log('Context stats:', stats);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesForAPI
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const data = JSON.parse(line.slice(2));
              if (data.type === 'text-delta') {
                assistantContent += data.textDelta;
                dispatch({
                  type: 'UPDATE_MESSAGE',
                  payload: {
                    chatId: currentChat.id,
                    messageId: assistantMessage.id,
                    updates: { content: assistantContent }
                  }
                });
              }
            } catch {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }

      // Save complete assistant message to database
      if (assistantContent) {
        try {
          const finalAssistantMessage = { ...assistantMessage, content: assistantContent };
          await fetch(`/api/chats/${currentChat.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [...currentChat.messages, userMessage, finalAssistantMessage]
            }),
          });
        } catch (error) {
          console.error('Failed to save assistant message:', error);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get response. Please try again.' });
      
      // Remove the empty assistant message on error
      dispatch({
        type: 'UPDATE_CHAT',
        payload: {
          id: currentChat.id,
          updates: {
            messages: currentChat.messages.filter(msg => msg.id !== assistantMessage.id)
          }
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.activeChat, createNewChat, updateChatTitle]);

  const updateMessage = useCallback(async (messageId: string, content: string) => {
    if (!state.activeChat) return;

    // Update message in local state first for immediate UI feedback
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        chatId: state.activeChat.id,
        messageId,
        updates: { content }
      }
    });

    // Update message in database
    try {
      const updatedMessages = state.activeChat.messages.map(msg =>
        msg.id === messageId ? { ...msg, content } : msg
      );

      const response = await fetch(`/api/chats/${state.activeChat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }

    } catch (error) {
      console.error('Failed to update message in database:', error);
      // Revert the local state change on error
      const originalMessage = state.activeChat.messages.find(msg => msg.id === messageId);
      if (originalMessage) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId: state.activeChat.id,
            messageId,
            updates: { content: originalMessage.content }
          }
        });
      }
    }
  }, [state.activeChat]);

  const regenerateResponse = useCallback(async (messageId: string) => {
    if (!state.activeChat) return;

    const messageIndex = state.activeChat.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Get all messages up to the one being regenerated
    const messagesUpToRegenerate = state.activeChat.messages.slice(0, messageIndex);

    // Clear the message content to show regenerating state
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        chatId: state.activeChat.id,
        messageId,
        updates: { content: '' }
      }
    });

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Prepare messages for API with context management
      const messagesForAPI = await prepareMessagesForAPI(
        messagesUpToRegenerate,
        undefined,
        {
          maxTokens: 4000,
          reserveTokensForResponse: 1000,
          model: 'gpt-3.5-turbo',
        }
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesForAPI
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const data = JSON.parse(line.slice(2));
              if (data.type === 'text-delta') {
                assistantContent += data.textDelta;
                dispatch({
                  type: 'UPDATE_MESSAGE',
                  payload: {
                    chatId: state.activeChat.id,
                    messageId,
                    updates: { content: assistantContent }
                  }
                });
              }
            } catch {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to regenerate response. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.activeChat]);

  const contextValue: ChatContextType = {
    ...state,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
    regenerateResponse,
    updateChatTitle,
    updateMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
