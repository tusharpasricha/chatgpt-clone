'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { useChat } from '@/contexts/chat-context';
import { useEffect } from 'react';

export default function ChatPage() {
  const { activeChat, clearActiveChat } = useChat();

  // When on the base /chat route, ensure no chat is selected to show welcome state
  useEffect(() => {
    if (activeChat) {
      // Clear the active chat to show welcome state
      clearActiveChat();
    }
  }, [activeChat, clearActiveChat]);

  return <ChatInterface />;
}
