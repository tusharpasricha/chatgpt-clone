'use client';

import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Share,
  Trash,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ChatHeader() {
  return (
    <header>
      <div className="flex items-center justify-between h-10 sm:h-12 px-3 sm:px-4">
        {/* Left side - Chat title */}
        <div className="flex items-center gap-3">
          <h1 className="font-medium text-sm text-foreground">ChatGPT</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground hover:text-foreground cursor-pointer"
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
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
