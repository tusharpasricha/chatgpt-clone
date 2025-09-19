'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/contexts/chat-context';
import { FileUpload } from './file-upload';
import { cn } from '@/lib/utils';
import {
  SendIcon,
  MicIcon,
  StopCircleIcon
} from 'lucide-react';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && selectedFiles.length === 0) || isLoading) return;

    const messageToSend = message.trim();
    const filesToSend = [...selectedFiles];
    setMessage(''); // Clear input immediately
    setSelectedFiles([]); // Clear files immediately

    try {
      let attachments: { type: string; url: string; name: string; size: number }[] = [];

      // Upload files if any
      if (filesToSend.length > 0) {
        const formData = new FormData();
        filesToSend.forEach(file => {
          formData.append('files', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload files');
        }

        const uploadResult = await uploadResponse.json();
        attachments = uploadResult.attachments;
      }

      await sendMessage(messageToSend, attachments);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message and files on error
      setMessage(messageToSend);
      setSelectedFiles(filesToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
    console.log('Recording toggled:', !isRecording);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-border/40 rounded-2xl sm:rounded-3xl bg-background shadow-sm focus-within:shadow-md transition-all duration-200 hover:border-border/60">
          {/* File Upload */}
          <div className="flex-shrink-0">
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFiles={selectedFiles}
              disabled={isLoading}
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
              "min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1",
              "placeholder:text-muted-foreground text-foreground"
            )}
            rows={1}
          />

          {/* Voice Recording Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-foreground cursor-pointer",
              isRecording && "text-red-500"
            )}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <StopCircleIcon className="h-4 w-4" />
            ) : (
              <MicIcon className="h-4 w-4" />
            )}
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            className={cn(
              "h-10 w-10 flex-shrink-0 rounded-full",
              message.trim() && !isLoading
                ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Character count or other info */}
      <div className="flex justify-between items-center mt-2 px-2 sm:px-3">
        <div className="text-xs text-muted-foreground">
          {isRecording && (
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              Recording...
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {message.length > 0 && `${message.length} characters`}
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center mt">
        <p className="text-xs text-muted-foreground">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
