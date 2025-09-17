'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Message } from '@/types';
import {
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshCwIcon,
  EditIcon,
  CheckIcon,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
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
        <div className={cn(
          "message-content prose prose-sm max-w-none break-words text-sm",
          isUser && "text-gray-900",
          isAssistant && "dark:prose-invert text-foreground"
        )}>
          <MessageContent content={message.content} />
        </div>

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
          <code className="text-sm font-mono">
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
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
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
