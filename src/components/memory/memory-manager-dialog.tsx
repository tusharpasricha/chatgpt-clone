/**
 * Memory Manager Dialog Component
 * Modal wrapper for the Memory Manager
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemoryManager } from './memory-manager';

interface MemoryManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryManagerDialog({ open, onOpenChange }: MemoryManagerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Memory Manager</span>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <MemoryManager />
        </div>
      </DialogContent>
    </Dialog>
  );
}
