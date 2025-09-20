'use client';

import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Share,
  Trash,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useChat } from '@/contexts/chat-context';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export function ChatHeader() {
  const { activeChat, deleteChat } = useChat();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    if (!activeChat) return;
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!activeChat) return;

    try {
      setIsDeleting(true);
      await deleteChat(activeChat.id);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <header>
      <div className="flex items-center justify-between h-10 sm:h-12 px-3 sm:px-4">
        {/* Left side - Sidebar trigger (mobile) + Chat title */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <h1 className="font-medium text-sm text-foreground">
            ChatGPT
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-20 text-sm text-foreground hover:text-foreground cursor-pointer"
          >
            <Share className="h-2 w-2" />
            Share
          </Button>
    

          {/* Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!activeChat}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleDeleteClick}
                disabled={!activeChat || isDeleting}
              >
                <Trash className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Chat"
        description={`Are you sure you want to delete "${activeChat?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </header>
  );
}
