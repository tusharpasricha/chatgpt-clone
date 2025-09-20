'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/contexts/chat-context';
import { cn } from '@/lib/utils';
import { type Message } from '@/types';
import {
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshCwIcon,
  EditIcon,
  CheckIcon,
  XIcon,
  FileIcon,
  DownloadIcon,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { regenerateResponse, editMessageAndRegenerate } = useChat();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() !== message.content) {
      await editMessageAndRegenerate(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleRegenerate = async () => {
    await regenerateResponse(message.id);
  };

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        "group relative transition-colors w-full",
        isUser && "flex justify-end",
        isAssistant && "flex justify-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Message Content */}
      <div className={cn(
        "p-4 overflow-hidden relative",
        isUser && "max-w-[70%] bg-gray-100 text-gray-900 rounded-2xl rounded-br-md",
        isAssistant && "w-full bg-transparent"
      )}>
        {isEditing && isUser ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] resize-none border-gray-200 focus:border-gray-300"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-6 px-2 text-[10px]"
              >
                <CheckIcon className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="h-6 px-2 text-[10px]"
              >
                <XIcon className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentDisplay key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}

            {/* Message Content */}
            {message.content && (
              <div className={cn(
                "message-content prose prose-sm max-w-none break-words text-xs",
                isUser && "text-gray-900",
                isAssistant && "dark:prose-invert text-foreground"
              )}>
                <MessageContent content={message.content} />
              </div>
            )}
          </div>
        )}

        {/* Reserved space for action buttons - prevents layout shift */}
        {isAssistant && (
          <div className="flex items-center gap-1 mt-3 h-7">
            <div className={cn(
              "flex items-center gap-1 transition-opacity duration-200",
              (isHovered || copied) ? "opacity-100" : "opacity-0"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
              >
                <ThumbsUpIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
              >
                <ThumbsDownIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
                onClick={handleRegenerate}
                title="Regenerate response"
              >
                <RefreshCwIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Reserved space for user message actions - prevents layout shift */}
        {isUser && (
          <div className="flex items-center gap-1 mt-3 justify-end h-7">
            <div className={cn(
              "flex items-center gap-1 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
                onClick={handleEdit}
                title="Edit message"
              >
                <EditIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-gray-400 hover:text-gray-600 rounded-md",
                  isUser ? "hover:bg-white/80" : "hover:bg-gray-50"
                )}
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced message content renderer with code block support
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }

    // Handle code blocks
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++; // Skip opening ```

      while (i < lines.length && lines[i] && !lines[i]!.startsWith('```')) {
        codeLines.push(lines[i]!);
        i++;
      }

      elements.push(
        <pre key={`code-${elements.length}`} className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code className="text-xs font-mono">
            {codeLines.join('\n')}
          </code>
        </pre>
      );
      i++; // Skip closing ```
    } else {
      // Handle regular text with inline code
      const parts = line.split(/(`[^`]+`)/g);
      elements.push(
        <p key={`text-${elements.length}`} className="mb-2 last:mb-0">
          {parts.map((part, partIndex) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code
                  key={partIndex}
                  className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
      i++;
    }
  }

  return <>{elements}</>;
}

// Attachment display component
function AttachmentDisplay({ attachment }: { attachment: { type: string; url: string; name: string; size: number } }) {
  const isImage = attachment.type === 'image';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isImage) {
    return (
      <div className="relative group max-w-sm">
        <Image
          src={attachment.url}
          alt={attachment.name}
          width={400}
          height={300}
          className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(attachment.url, '_blank')}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={handleDownload}
            title="Download image"
          >
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1 text-[10px] text-gray-500">
          {attachment.name} • {formatFileSize(attachment.size)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-gray-100 border max-w-sm">
      <div className="flex-shrink-0">
        <FileIcon className="h-8 w-8 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">
          {attachment.name}
        </div>
        <div className="text-[10px] text-gray-500">
          {formatFileSize(attachment.size)}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-gray-600 flex-shrink-0"
        onClick={handleDownload}
        title="Download file"
      >
        <DownloadIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
