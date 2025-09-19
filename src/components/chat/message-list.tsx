'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/components/chat/message-bubble';
import { useChat } from '@/contexts/chat-context';

export function MessageList({ className }: { className?: string }) {
  const { activeChat, isLoading, error } = useChat();
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

      {/* Loading indicator */}
      {isLoading && messages.length > 0 && (
        <div className="flex justify-start">
          <div className="p-4 max-w-[70%]">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
