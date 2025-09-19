'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ChatProvider, useChat } from '@/contexts/chat-context';
import { ChatGPTSidebar } from '@/components/chat/chatgpt-sidebar';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';

function ChatContent() {
  const { activeChat } = useChat();

  // Welcome state - center everything
  if (!activeChat) {
    return (
      <SidebarInset className="flex flex-col flex-1 w-full relative h-screen">
        {/* Header - Fixed at top */}
        <div className="sticky top-0 z-10 bg-background">
          <ChatHeader />
        </div>

        {/* Centered Welcome Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-64">
          <div className="w-full max-w-2xl flex flex-col items-center space-y-8">
            {/* Welcome Message */}
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-500">What&apos;s on the agenda today?</h3>
            </div>

            {/* Centered Input */}
            <div className="w-full">
              <MessageInput />
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  // Normal chat state - messages with input at bottom
  return (
    <SidebarInset className="flex flex-col flex-1 w-full relative h-screen">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 z-10 bg-background">
        <ChatHeader />
      </div>

      {/* Messages Area - Scrollable behind header and input */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 sm:px-8 md:px-16 lg:px-64">
          <MessageList />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="sticky bottom-0 z-10 py-0">
        <div className="px-4 sm:px-8 md:px-16 lg:px-64 py-1">
          <MessageInput />
        </div>
      </div>
    </SidebarInset>
  );
}

export function ChatInterface() {
  return (
    <ChatProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen overflow-hidden w-full">
          {/* Sidebar */}
          <ChatGPTSidebar />

          {/* Main Chat Area */}
          <ChatContent />
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
