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

import { cn } from '@/lib/utils/utils';
import {
  PenSquareIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  MoreHorizontal,
  Trash2Icon,
  EditIcon,
  Brain,
} from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { MemoryManagerDialog } from '@/components/memory/memory-manager-dialog';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ChatGPTSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { chats, activeChat, selectChat, createNewChat, deleteChat, updateChatTitle, isLoading, isLoadingChats } = useChat();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isMemoryManagerOpen, setIsMemoryManagerOpen] = useState(false);

  const handleDeleteClick = (chatId: string) => {
    setChatToDelete(chatId);
  };

  const handleRenameClick = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatToRename(chatId);
      setNewTitle(chat.title);
    }
  };

  const handleConfirmRename = async () => {
    if (!chatToRename || !newTitle.trim()) return;

    try {
      await updateChatTitle(chatToRename, newTitle.trim());
      setChatToRename(null);
      setNewTitle('');
    } catch (error) {
      console.error('Failed to rename chat:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      setIsDeleting(true);
      await deleteChat(chatToDelete);
      // Dialog will be closed by the confirmation dialog component
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // Re-throw error so confirmation dialog doesn't close
      throw error;
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  const getChatToDeleteTitle = () => {
    const chat = chats.find(c => c.id === chatToDelete);
    return chat?.title || 'this chat';
  };

  return (
    <>
      <Sidebar collapsible="icon" className="bg-gray-50">
      <SidebarHeader className="p-2">
        {/* Expanded State: Logo and Close Button */}
        <div className="flex items-center justify-between mb-2 group-data-[collapsible=icon]:hidden">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#000000"/>
            </svg>
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

        {/* Action Buttons */}
        <div className="space-y-1">
          <SidebarMenuButton
            className="w-full justify-start text-gray-700 hover:bg-gray-100 h-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            tooltip="New chat"
            disabled={isCreatingChat || isLoading}
            onClick={() => {
              try {
                setIsCreatingChat(true);
                createNewChat();
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
          <SidebarMenuButton
            className="w-full justify-start text-gray-700 hover:bg-gray-100 h-8 cursor-pointer"
            tooltip="Memory Manager"
            onClick={() => {
              setIsMemoryManagerOpen(true);
              if (isMobile) {
                toggleSidebar();
              }
            }}
          >
            <Brain className="h-4 w-4" />
            <span>Memory</span>
          </SidebarMenuButton>
        </div>
      </SidebarHeader>

      <SidebarContent>
        

        {/* Chats Section - Hidden in collapsed state */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden flex-1 overflow-hidden">
          <SidebarGroupLabel className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin">
              <SidebarMenu>
                {isLoadingChats ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      <span className="text-xs">Loading chats...</span>
                    </div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-xs text-gray-500">No chats yet</span>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const isTemporary = chat.id.startsWith('temp-');
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <div className="group relative flex items-center w-full">
                          <SidebarMenuButton
                            isActive={activeChat?.id === chat.id}
                            className={cn(
                              "text-gray-700 hover:bg-gray-100 cursor-pointer flex-1 pr-8",
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
                              <span className="text-[10px] text-gray-400 ml-auto">Creating...</span>
                            )}
                          </SidebarMenuButton>

                          {/* Dropdown menu - only show for non-temporary chats */}
                          {!isTemporary && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "absolute right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                    "text-gray-400 hover:text-gray-600"
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleRenameClick(chat.id)}
                                >
                                  <EditIcon className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteClick(chat.id)}
                                >
                                  <Trash2Icon className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
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
                {!isUserLoaded ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
                ) : (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                )}
                <div className="ml-2">
                  {!isUserLoaded ? (
                    <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
                  ) : (
                    <span>
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.emailAddresses[0]?.emailAddress || 'User'
                      }
                    </span>
                  )}
                </div>
              </div>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      </Sidebar>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!chatToDelete}
        onOpenChange={(open) => !open && setChatToDelete(null)}
        title="Delete Chat"
        description={`Are you sure you want to delete "${getChatToDeleteTitle()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Rename Dialog */}
      <Dialog open={!!chatToRename} onOpenChange={(open) => !open && setChatToRename(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Chat name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChatToRename(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={!newTitle.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Memory Manager Dialog */}
      <MemoryManagerDialog
        open={isMemoryManagerOpen}
        onOpenChange={setIsMemoryManagerOpen}
      />
    </>
  );
}
