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

  if (!activeChat) {
    return (
      <div className={`py-8 space-y-12 ${className || ''}`}>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Welcome to ChatGPT Clone</h3>
            <p className="text-sm">Start a conversation by typing a message below.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-8 space-y-12 ${className || ''}`}>
        <div className="flex items-center justify-center h-64 text-red-500">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p className="text-sm">{error}</p>
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
          <div className="bg-gray-100 rounded-2xl p-4 max-w-[70%]">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
