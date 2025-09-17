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
  UserIcon,
  PanelLeftIcon,
} from 'lucide-react';
import { useChat } from '@/hooks/use-chat';

export function ChatGPTSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { chats, selectChat, createNewChat } = useChat();

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
          className="w-full justify-start text-gray-700 hover:bg-gray-100 h-10 cursor-pointer"
          tooltip="New chat"
          onClick={() => {
            createNewChat();
            // On mobile, close sidebar after action
            if (isMobile) {
              toggleSidebar();
            }
          }}
        >
          <PenSquareIcon className="h-4 w-4" />
          <span>New chat</span>
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
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={chat.isActive || false}
                      className={cn(
                        "text-gray-700 hover:bg-gray-100 cursor-pointer",
                        chat.isActive && "bg-gray-200 text-gray-900"
                      )}
                      onClick={() => {
                        selectChat(chat.id);
                        // On mobile, close sidebar after selecting a chat
                        if (isMobile) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
                <UserIcon className="h-4 w-4 mr-2" />
                <span>Tushar Pasri...</span>
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
