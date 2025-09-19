'use client';


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';
import {
  PenSquareIcon,
  MessageSquareIcon,
  PanelLeftIcon,
} from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';

export function ChatGPTSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { chats, activeChat, selectChat, createNewChat, isLoading, isLoadingChats } = useChat();
  const { user } = useUser();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  return (
    <Sidebar collapsible="icon" className="bg-gray-50">
      <SidebarHeader className="p-2">
        {/* Expanded State: Logo and Close Button */}
        <div className="flex items-center justify-between mb-2 group-data-[collapsible=icon]:hidden">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          <SidebarMenuButton
            tooltip="Close sidebar"
            className="h-8 w-8 justify-center cursor-pointer"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon className="h-4 w-4" />
          </SidebarMenuButton>
        </div>

        {/* Collapsed State: Open Sidebar Icon */}
        <div className="hidden group-data-[collapsible=icon]:block mb-2">
          <SidebarMenuButton
            tooltip="Open sidebar"
            className="w-full justify-center cursor-pointer"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon className="h-4 w-4" />
          </SidebarMenuButton>
        </div>

        {/* New Chat Button */}
        <SidebarMenuButton
          className="w-full justify-start text-gray-700 hover:bg-gray-100 h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          tooltip="New chat"
          disabled={isCreatingChat || isLoading}
          onClick={async () => {
            try {
              setIsCreatingChat(true);
              await createNewChat();
              // On mobile, close sidebar after action
              if (isMobile) {
                toggleSidebar();
              }
            } catch (error) {
              console.error('Failed to create new chat:', error);
            } finally {
              setIsCreatingChat(false);
            }
          }}
        >
          <PenSquareIcon className={`h-4 w-4 ${isCreatingChat ? 'animate-spin' : ''}`} />
          <span>{isCreatingChat ? 'Creating...' : 'New chat'}</span>
        </SidebarMenuButton>


      </SidebarHeader>

      <SidebarContent>
        

        {/* Chats Section - Hidden in collapsed state */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden flex-1 overflow-hidden">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin">
              <SidebarMenu>
                {isLoadingChats ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      <span className="text-sm">Loading chats...</span>
                    </div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-gray-500">No chats yet</span>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const isTemporary = chat.id.startsWith('temp-');
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          isActive={activeChat?.id === chat.id}
                          className={cn(
                            "text-gray-700 hover:bg-gray-100 cursor-pointer",
                            activeChat?.id === chat.id && "bg-gray-200 text-gray-900",
                            isTemporary && "opacity-75"
                          )}
                          onClick={() => {
                            selectChat(chat.id);
                            // On mobile, close sidebar after selecting a chat
                            if (isMobile) {
                              toggleSidebar();
                            }
                          }}
                        >
                          <MessageSquareIcon className={cn(
                            "h-4 w-4",
                            isTemporary && "animate-pulse"
                          )} />
                          <span className="truncate">{chat.title}</span>
                          {isTemporary && (
                            <span className="text-xs text-gray-400 ml-auto">Creating...</span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-gray-700 hover:bg-gray-100 justify-between cursor-pointer">
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
                <span className="ml-2">{user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Free</span>
                <span className="h-6 px-2 text-xs bg-gray-900 text-white rounded-md flex items-center hover:bg-gray-800 transition-colors">
                  Upgrade
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
