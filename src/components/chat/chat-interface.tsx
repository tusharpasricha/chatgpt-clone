'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ChatGPTSidebar } from '@/components/chat/chatgpt-sidebar';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';

export function ChatInterface() {

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <ChatGPTSidebar />

        {/* Main Chat Area */}
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white relative">
          {/* Header - Fixed at top */}
          <div className="sticky top-0 z-10 bg-gray-50">
            <ChatHeader />
          </div>

          {/* Messages Area - Scrollable behind header and input */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full px-32">
              <MessageList />
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="sticky bottom-0 z-10">
            <div className="px-32 py-6">
              <MessageInput />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
