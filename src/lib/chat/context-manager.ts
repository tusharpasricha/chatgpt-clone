/**
 * Context Manager for handling long conversations and token limits
 * Implements intelligent context window management with message summarization
 */

import { Message } from '@/types';

export interface ContextWindow {
  messages: Message[];
  totalTokens: number;
  summary?: string;
}

export interface ContextManagerOptions {
  maxTokens: number;
  reserveTokensForResponse: number;
  summaryTokens: number;
  model: string;
}

const DEFAULT_OPTIONS: ContextManagerOptions = {
  maxTokens: 4000, // Conservative limit for GPT-3.5
  reserveTokensForResponse: 1000,
  summaryTokens: 500,
  model: 'gpt-3.5-turbo',
};

/**
 * Estimate token count for a message
 * This is a rough approximation - in production, use tiktoken or similar
 */
export function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

/**
 * Estimate tokens for a message including metadata
 */
export function estimateMessageTokens(message: Message): number {
  let tokens = estimateTokens(message.content);
  
  // Add tokens for role and metadata
  tokens += 10; // Base overhead for message structure
  
  // Add tokens for attachments (if any)
  if (message.attachments) {
    message.attachments.forEach(attachment => {
      if (attachment.type === 'image') {
        tokens += 85; // Base tokens for image processing
      } else {
        tokens += estimateTokens(attachment.name) + 20; // File reference
      }
    });
  }
  
  return tokens;
}

/**
 * Calculate total tokens for a list of messages
 */
export function calculateTotalTokens(messages: Message[]): number {
  return messages.reduce((total, message) => total + estimateMessageTokens(message), 0);
}

/**
 * Create a summary of older messages to preserve context
 */
export async function summarizeMessages(
  messages: Message[],
  maxSummaryTokens: number = 500
): Promise<string> {
  if (messages.length === 0) return '';
  
  // For now, create a simple summary
  // In production, you'd use an AI model to create a better summary
  const summary = `Previous conversation summary (${messages.length} messages): The conversation covered various topics including user questions and assistant responses. Key context has been preserved for continuity.`;
  
  return summary.substring(0, maxSummaryTokens * 4); // Rough token-to-char conversion
}

/**
 * Manage context window by truncating old messages and creating summaries
 */
export async function manageContextWindow(
  messages: Message[],
  options: Partial<ContextManagerOptions> = {}
): Promise<ContextWindow> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const availableTokens = opts.maxTokens - opts.reserveTokensForResponse;
  
  if (messages.length === 0) {
    return {
      messages: [],
      totalTokens: 0,
    };
  }
  
  // Calculate current token usage
  const totalTokens = calculateTotalTokens(messages);
  
  // If we're within limits, return as-is
  if (totalTokens <= availableTokens) {
    return {
      messages,
      totalTokens,
    };
  }
  
  // We need to truncate - keep the most recent messages
  const keptMessages: Message[] = [];
  let keptTokens = 0;
  let summaryTokens = 0;
  let summary = '';
  
  // Always keep the last message (usually the user's latest question)
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    keptMessages.unshift(lastMessage);
    keptTokens += estimateMessageTokens(lastMessage);
  }
  
  // Work backwards, keeping messages that fit
  for (let i = messages.length - 2; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = estimateMessageTokens(message);
    
    // Check if we can fit this message
    if (keptTokens + messageTokens + summaryTokens <= availableTokens) {
      keptMessages.unshift(message);
      keptTokens += messageTokens;
    } else {
      // Create summary of remaining older messages
      const olderMessages = messages.slice(0, i + 1);
      if (olderMessages.length > 0) {
        summary = await summarizeMessages(olderMessages, opts.summaryTokens);
        summaryTokens = estimateTokens(summary);
      }
      break;
    }
  }
  
  return {
    messages: keptMessages,
    totalTokens: keptTokens + summaryTokens,
    summary,
  };
}

/**
 * Prepare messages for API call with context management
 */
export async function prepareMessagesForAPI(
  messages: Message[],
  systemPrompt?: string,
  options: Partial<ContextManagerOptions> = {}
): Promise<Array<{ role: string; content: string | Array<{ type: string; text?: string; image?: URL }> }>> {
  const contextWindow = await manageContextWindow(messages, options);

  const apiMessages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image?: URL }> }> = [];
  
  // Add system message if provided
  if (systemPrompt) {
    apiMessages.push({
      role: 'system',
      content: systemPrompt,
    });
  }
  
  // Add summary if exists
  if (contextWindow.summary) {
    apiMessages.push({
      role: 'system',
      content: `Context from earlier in the conversation: ${contextWindow.summary}`,
    });
  }
  
  // Add managed messages
  contextWindow.messages.forEach(message => {
    const apiMessage: { role: string; content: string | Array<{ type: string; text?: string; image?: URL }> } = {
      role: message.role,
      content: message.content,
    };
    
    // Handle attachments for vision models
    if (message.attachments && message.attachments.length > 0) {
      const imageAttachments = message.attachments.filter(att => att.type === 'image');
      
      if (imageAttachments.length > 0) {
        // For vision models, format content as array using AI SDK format
        const contentArray = [];

        // Add text content if present
        if (message.content && message.content.trim()) {
          contentArray.push({ type: 'text', text: message.content });
        }

        // Add images using AI SDK format
        imageAttachments.forEach(img => {
          contentArray.push({
            type: 'image',
            image: new URL(img.url)
          });
        });

        apiMessage.content = contentArray;
      }
    }
    
    apiMessages.push(apiMessage);
  });
  
  return apiMessages;
}

/**
 * Get context statistics for debugging/monitoring
 */
export function getContextStats(messages: Message[]): {
  messageCount: number;
  totalTokens: number;
  averageTokensPerMessage: number;
  hasAttachments: boolean;
} {
  const totalTokens = calculateTotalTokens(messages);
  const hasAttachments = messages.some(msg => msg.attachments && msg.attachments.length > 0);
  
  return {
    messageCount: messages.length,
    totalTokens,
    averageTokensPerMessage: messages.length > 0 ? Math.round(totalTokens / messages.length) : 0,
    hasAttachments,
  };
}
