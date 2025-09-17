'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  SendIcon, 
  PaperclipIcon, 
  MicIcon,
  StopCircleIcon
} from 'lucide-react';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    // TODO: Implement actual message sending
    console.log('Sending message:', message);
    
    // Simulate sending delay
    setTimeout(() => {
      setMessage('');
      setIsSending(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload
    console.log('File upload clicked');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
    console.log('Recording toggled:', !isRecording);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2 px-3 py-1 border border-border/40 rounded-3xl bg-background shadow-sm focus-within:shadow-md transition-all duration-200 hover:border-border/60">
          {/* File Upload Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={handleFileUpload}
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>

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
              message.trim() && !isSending
                ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            disabled={!message.trim() || isSending}
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Character count or other info */}
      <div className="flex justify-between items-center mt-2 px-3">
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
