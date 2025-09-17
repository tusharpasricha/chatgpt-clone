'use client';

import { useMemo } from 'react';
import { MessageBubble } from '@/components/chat/message-bubble';
import { type Message } from '@/types';

// Sample messages data - in a real app, this would come from props or context
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    content: 'I need help building a React component with TypeScript. Can you show me how to create a reusable button component?',
    role: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
  },
  {
    id: '3',
    content: `I'd be happy to help you create a reusable button component in React with TypeScript! Here's a comprehensive example:

\`\`\`tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
\`\`\`

This button component includes:

1. **TypeScript interfaces** for type safety
2. **Multiple variants** (primary, secondary, outline, ghost)
3. **Different sizes** (sm, md, lg)
4. **Loading state** with spinner
5. **Disabled state** handling
6. **Flexible styling** with className override
7. **All native button props** support

You can use it like this:

\`\`\`tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>

<Button variant="outline" loading={isLoading}>
  Submit
</Button>
\`\`\`

The component is fully reusable and follows React and TypeScript best practices!`,
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
  },
];

interface MessageListProps {
  messages?: Message[];
  className?: string;
}

export function MessageList({ messages = SAMPLE_MESSAGES, className }: MessageListProps) {
  // Memoize the empty state to prevent unnecessary re-renders
  const emptyState = useMemo(() => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-normal text-foreground mb-8">
          Where should we begin?
        </h2>
      </div>
    </div>
  ), []);

  // Early return for empty messages
  if (messages.length === 0) {
    return emptyState;
  }

  // Early return for empty messages
  if (messages.length === 0) {
    return emptyState;
  }

  // Render messages list
  return (
    <div className={`py-8  space-y-12 ${className || ''}`}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
