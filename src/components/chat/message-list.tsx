'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/components/chat/message-bubble';
import { useChat } from '@/contexts/chat-context';

export function MessageList({ className }: { className?: string }) {
  const { activeChat, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeChat?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // This component should only render when there's an active chat
  // The welcome state is now handled in ChatInterface
  if (!activeChat) {
    return null;
  }

  if (error) {
    return (
      <div className={`py-8 space-y-12 ${className || ''}`}>
        <div className="flex items-center justify-center h-64 text-red-500">
          <div className="text-center">
            <h3 className="text-base font-medium mb-2">Error</h3>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 space-y-12 ${className || ''}`}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
