'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/contexts/chat-context';
import { UploadcareFileUpload } from './uploadcare-file-upload';
import { FilePreview } from './file-preview';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types';
import {
  SendIcon
} from 'lucide-react';

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  isUploading: boolean;
}

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { sendMessage, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleFileSelect = (attachments: Attachment[]) => {
    setSelectedAttachments(prev => [...prev, ...attachments]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadingFilesChange = (files: UploadingFile[]) => {
    setUploadingFiles(files);
  };

  const handleRemoveUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && selectedAttachments.length === 0) || isLoading) return;

    const messageToSend = message.trim();
    const attachmentsToSend = [...selectedAttachments];
    setMessage(''); // Clear input immediately
    setSelectedAttachments([]); // Clear attachments immediately

    try {
      await sendMessage(messageToSend, attachmentsToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message and attachments on error
      setMessage(messageToSend);
      setSelectedAttachments(attachmentsToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative border !border-black/15 rounded-2xl sm:rounded-3xl bg-background shadow-sm focus-within:shadow-md transition-all duration-200 hover:border-border/30">
          {/* File Preview */}
          <FilePreview
            attachments={selectedAttachments}
            uploadingFiles={uploadingFiles}
            onRemoveAttachment={handleFileRemove}
            onRemoveUploadingFile={handleRemoveUploadingFile}
            disabled={isLoading}
          />

          {/* Input Area */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1">
            {/* File Upload */}
            <div className="flex-shrink-0">
              <UploadcareFileUpload
                onFileSelect={handleFileSelect}
                disabled={isLoading}
                uploadingFiles={uploadingFiles}
                onUploadingFilesChange={handleUploadingFilesChange}
              />
            </div>

            {/* Message Input */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className={cn(
                "min-h-[40px] max-h-[200px] resize-none shadow-none border-0 bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1",
                "placeholder:text-muted-foreground text-foreground"
              )}
              rows={1}
            />

            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              className={cn(
                "h-10 w-10 flex-shrink-0 rounded-full",
                (message.trim() || selectedAttachments.length > 0 || uploadingFiles.length > 0) && !isLoading
                  ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={(!message.trim() && selectedAttachments.length === 0) || isLoading || uploadingFiles.length > 0}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      

      {/* Footer text */}
      <div className="text-center mt">
        <p className="text-[10px] text-muted-foreground">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
