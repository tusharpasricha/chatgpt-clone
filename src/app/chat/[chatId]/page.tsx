'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useChat } from '@/contexts/chat-context';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { chats, activeChat, selectChat, isLoadingChats } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingChats) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        // Chat exists, select it
        if (activeChat?.id !== chatId) {
          selectChat(chatId);
        }
      } else if (chats.length > 0) {
        // Chat doesn't exist, redirect to the general chat page
        router.replace('/chat');
      }
      // If chats are still loading, wait
    }
  }, [chatId, chats, activeChat, selectChat, isLoadingChats, router]);

  // Show loading state while determining if chat exists
  if (isLoadingChats || (chats.length > 0 && !activeChat)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no chat found and not loading, redirect will happen in useEffect
  if (!activeChat && !isLoadingChats) {
    return null;
  }

  return <ChatInterface />;
}
