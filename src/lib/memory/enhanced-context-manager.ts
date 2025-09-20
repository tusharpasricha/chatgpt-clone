/**
 * Enhanced Context Manager with Mem0 Integration
 * Combines traditional context management with advanced memory capabilities
 */

import { Message } from '@/types';
import { mem0Service, MemoryEntry } from './mem0-service';
import { MemoryType } from './mem0-config';
import { 
  prepareMessagesForAPI as originalPrepareMessages,
  ContextManagerOptions,
  estimateMessageTokens,
  estimateTokens
} from '../chat/context-manager';
import { MEMORY_CONFIG } from './mem0-config';

export interface EnhancedContextOptions extends ContextManagerOptions {
  userId: string;
  chatId?: string;
  includeMemories?: boolean;
  memoryWeight?: number;
  maxMemories?: number;
}

export interface EnhancedContextWindow {
  messages: Message[];
  memories: MemoryEntry[];
  totalTokens: number;
  memoryTokens: number;
  summary?: string;
  memoryContext?: string;
}

/**
 * Enhanced context manager that integrates Mem0 memories with conversation context
 */
export class EnhancedContextManager {
  /**
   * Prepare messages for API with memory enhancement
   */
  async prepareMessagesWithMemory(
    messages: Message[],
    systemPrompt?: string,
    options: EnhancedContextOptions = {} as EnhancedContextOptions
  ): Promise<Array<{ role: string; content: string | Array<{ type: string; text?: string; image?: URL }> }>> {
    const {
      userId,
      chatId,
      includeMemories = MEMORY_CONFIG.ENHANCE_CONTEXT_WITH_MEMORIES,
      memoryWeight = MEMORY_CONFIG.MEMORY_CONTEXT_WEIGHT,
      maxMemories = MEMORY_CONFIG.MAX_CONTEXT_MEMORIES,
      ...contextOptions
    } = options;

    // Get the enhanced context window
    const contextWindow = await this.getEnhancedContextWindow(
      messages,
      userId,
      chatId,
      {
        includeMemories,
        memoryWeight,
        maxMemories,
        ...contextOptions,
      }
    );

    // Start with original message preparation
    const apiMessages = await originalPrepareMessages(
      contextWindow.messages,
      systemPrompt,
      contextOptions
    );

    // Add memory context if available and memories are included
    if (includeMemories && contextWindow.memoryContext && mem0Service.isAvailable()) {
      // Insert memory context after system prompt but before conversation
      const memoryMessage = {
        role: 'system',
        content: `Relevant memories and context: ${contextWindow.memoryContext}`,
      };

      // Find the right position to insert memory context
      const systemMessageIndex = apiMessages.findIndex(msg => msg.role === 'system');
      if (systemMessageIndex >= 0) {
        // Insert after existing system messages
        apiMessages.splice(systemMessageIndex + 1, 0, memoryMessage);
      } else {
        // Insert at the beginning if no system message exists
        apiMessages.unshift(memoryMessage);
      }
    }

    return apiMessages;
  }

  /**
   * Get enhanced context window with memories
   */
  async getEnhancedContextWindow(
    messages: Message[],
    userId: string,
    chatId?: string,
    options: Partial<EnhancedContextOptions> = {}
  ): Promise<EnhancedContextWindow> {
    const {
      includeMemories = MEMORY_CONFIG.ENHANCE_CONTEXT_WITH_MEMORIES,
      maxMemories = MEMORY_CONFIG.MAX_CONTEXT_MEMORIES,
      maxTokens = 4000,
      reserveTokensForResponse = 1000,
    } = options;

    // Start with empty context window
    const contextWindow: EnhancedContextWindow = {
      messages,
      memories: [],
      totalTokens: 0,
      memoryTokens: 0,
    };

    // Calculate base message tokens
    const baseTokens = messages.reduce((total, msg) => total + estimateMessageTokens(msg), 0);
    contextWindow.totalTokens = baseTokens;

    // Get relevant memories if enabled and service is available
    if (includeMemories && mem0Service.isAvailable() && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        const memories = await mem0Service.getContextMemories(
          lastMessage.content,
          userId,
          chatId
        );

        // Limit memories and calculate tokens
        const limitedMemories = memories.slice(0, maxMemories);
        const memoryContext = this.buildMemoryContext(limitedMemories);
        const memoryTokens = estimateTokens(memoryContext);

        // Check if we have room for memories
        const availableTokens = maxTokens - reserveTokensForResponse;
        if (baseTokens + memoryTokens <= availableTokens) {
          contextWindow.memories = limitedMemories;
          contextWindow.memoryContext = memoryContext;
          contextWindow.memoryTokens = memoryTokens;
          contextWindow.totalTokens = baseTokens + memoryTokens;
        }
      }
    }

    return contextWindow;
  }

  /**
   * Process new message and extract memories
   */
  async processNewMessage(
    message: Message,
    userId: string,
    chatId: string
  ): Promise<MemoryEntry[]> {
    if (!mem0Service.isAvailable()) return [];

    // Extract memories from the message
    const extractedMemories = mem0Service.extractMemoriesFromMessage(message, userId, chatId);

    // Add extracted memories to Mem0
    const addedMemories: MemoryEntry[] = [];
    for (const memory of extractedMemories) {
      const memoryId = await mem0Service.addMemory(memory);
      if (memoryId) {
        addedMemories.push({ ...memory, id: memoryId });
      }
    }

    return addedMemories;
  }

  /**
   * Build memory context string from memory entries
   */
  private buildMemoryContext(memories: MemoryEntry[]): string {
    if (memories.length === 0) return '';

    const contextParts: string[] = [];

    // Group memories by type
    const memoryGroups = memories.reduce((groups, memory) => {
      const type = memory.metadata.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(memory);
      return groups;
    }, {} as Record<MemoryType, MemoryEntry[]>);

    // Build context for each type
    Object.entries(memoryGroups).forEach(([type, typeMemories]) => {
      const typeLabel = this.getMemoryTypeLabel(type as MemoryType);
      const memoryContents = typeMemories
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .map(memory => memory.content)
        .join('; ');
      
      contextParts.push(`${typeLabel}: ${memoryContents}`);
    });

    return contextParts.join('\n');
  }

  /**
   * Get human-readable label for memory type
   */
  private getMemoryTypeLabel(type: MemoryType): string {
    const labels: Record<MemoryType, string> = {
      [MemoryType.USER_PREFERENCE]: 'User Preferences',
      [MemoryType.CONVERSATION_CONTEXT]: 'Previous Context',
      [MemoryType.FACTUAL_KNOWLEDGE]: 'Known Facts',
      [MemoryType.BEHAVIORAL_PATTERN]: 'Behavioral Patterns',
      [MemoryType.TOPIC_EXPERTISE]: 'Topic Expertise',
      [MemoryType.PERSONAL_INFO]: 'Personal Information',
    };

    return labels[type] || 'General Memory';
  }

  /**
   * Get memory statistics for a user
   */
  async getMemoryStats(userId: string): Promise<{
    totalMemories: number;
    memoriesByType: Record<MemoryType, number>;
    oldestMemory?: Date;
    newestMemory?: Date;
  }> {
    if (!mem0Service.isAvailable()) {
      return {
        totalMemories: 0,
        memoriesByType: {} as Record<MemoryType, number>,
      };
    }

    const memories = await mem0Service.getUserMemories(userId);
    
    const memoriesByType = memories.reduce((counts, memory) => {
      const type = memory.metadata.type;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {} as Record<MemoryType, number>);

    const timestamps = memories.map(m => m.metadata.timestamp).sort();
    
    return {
      totalMemories: memories.length,
      memoriesByType,
      oldestMemory: timestamps[0],
      newestMemory: timestamps[timestamps.length - 1],
    };
  }

  /**
   * Clean up old memories for a user
   */
  async cleanupUserMemories(userId: string): Promise<number> {
    if (!mem0Service.isAvailable()) return 0;
    return await mem0Service.cleanupExpiredMemories(userId);
  }

  /**
   * Search user memories
   */
  async searchUserMemories(
    query: string,
    userId: string,
    options: {
      limit?: number;
      memoryTypes?: MemoryType[];
      minRelevance?: number;
    } = {}
  ): Promise<MemoryEntry[]> {
    if (!mem0Service.isAvailable()) return [];
    return await mem0Service.searchMemories(query, userId, options);
  }

  /**
   * Get relevant memories for enhancing conversation context
   */
  async getRelevantMemories(userId: string, query: string, limit: number = 5): Promise<string[]> {
    if (!this.isMemoryAvailable()) {
      return [];
    }

    try {
      // Search for relevant memories based on the query
      const memories = await mem0Service.searchMemories(query, userId, { limit });

      // Format memories as context strings
      return memories.map(memory => memory.content);
    } catch (error) {
      console.error('Error getting relevant memories:', error);
      return [];
    }
  }

  /**
   * Enhance conversation context with relevant memories
   */
  async enhanceConversationContext(userId: string, userMessage: string): Promise<string> {
    if (!this.isMemoryAvailable()) {
      return '';
    }

    try {
      // Get relevant memories for the user's message
      const relevantMemories = await this.getRelevantMemories(userId, userMessage, 3);

      if (relevantMemories.length === 0) {
        return '';
      }

      // Format memories as context
      const memoryContext = relevantMemories
        .map(memory => `- ${memory}`)
        .join('\n');

      return `\n\nRelevant information about the user:\n${memoryContext}`;
    } catch (error) {
      console.error('Error enhancing conversation context:', error);
      return '';
    }
  }

  /**
   * Check if memory service is available
   */
  isMemoryAvailable(): boolean {
    return mem0Service.isAvailable();
  }
}

// Export singleton instance
export const enhancedContextManager = new EnhancedContextManager();
