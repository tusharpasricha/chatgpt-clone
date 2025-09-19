'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ChatProvider } from '@/contexts/chat-context';
import { ChatGPTSidebar } from '@/components/chat/chatgpt-sidebar';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';

export function ChatInterface() {
  return (
    <ChatProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen overflow-hidden w-full">
          {/* Sidebar */}
          <ChatGPTSidebar />

          {/* Main Chat Area */}
          <SidebarInset className="flex flex-col flex-1 w-full relative h-screen">
            {/* Header - Fixed at top */}
            <div className="sticky top-0 z-10 bg-background">
              <ChatHeader />
            </div>

            {/* Messages Area - Scrollable behind header and input */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="w-full px-4 sm:px-8 md:px-16 lg:px-16">
                <MessageList />
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="sticky bottom-0 z-10 bg-background">
              <div className="px-4 sm:px-8 md:px-16 lg:px-16 py-4 sm:py-6">
                <MessageInput />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
