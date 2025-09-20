/**
 * Mem0 Service - Advanced Memory Management Integration
 * Provides sophisticated memory operations for ChatGPT Clone
 */

import { 
  getMem0Client, 
  MemoryEntry, 
  MemoryType, 
  MemoryMetadata, 
  MEMORY_CONFIG,
  MEMORY_PATTERNS 
} from './mem0-config';
import { Message } from '@/types';

export class Mem0Service {
  private client = getMem0Client();

  constructor() {
    if (!this.client) {
      if (typeof window === 'undefined') {
        // Only log on server side
        console.warn('Mem0 client not available - memory features will be disabled');
      }
    }
  }

  /**
   * Convert long Clerk user IDs to shorter format for Mem0 compatibility
   */
  private getSimplifiedUserId(userId: string): string {
    return `user_${userId.slice(-8)}`;
  }

  /**
   * Safely parse timestamp to avoid Invalid Date errors
   */
  private parseTimestamp(timestamp: string | number | Date | null | undefined): Date {
    if (!timestamp) return new Date();

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp, 'using current date');
      return new Date();
    }

    return date;
  }

  /**
   * Add a memory entry to Mem0
   */
  async addMemory(entry: MemoryEntry): Promise<string | null> {
    if (!this.client) return null;

    try {
      console.log('Adding memory to Mem0:', {
        content: entry.content,
        userId: entry.userId,
        metadata: entry.metadata
      });

      // Use direct HTTP API call since SDK is having issues
      // Use simplified user_id format for Mem0 compatibility
      const simpleUserId = this.getSimplifiedUserId(entry.userId);
      const requestBody = {
        messages: [{ role: 'user', content: entry.content }],
        user_id: simpleUserId,
        version: 'v2'
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      console.log('API Key (first 10 chars):', process.env.MEM0_API_KEY?.substring(0, 10));
      console.log('Simplified user_id:', simpleUserId, 'from original:', entry.userId);

      const response = await fetch('https://api.mem0.ai/v1/memories/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.MEM0_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      console.log('Mem0 API response:', result);

      // Response is an array, get the first item's id
      const memoryId = result?.[0]?.id || null;
      console.log('Memory added with ID:', memoryId);
      return memoryId;
    } catch (error) {
      console.error('Failed to add memory:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return null;
    }
  }

  /**
   * Search for relevant memories
   */
  async searchMemories(
    query: string, 
    userId: string, 
    options: {
      limit?: number;
      memoryTypes?: MemoryType[];
      minRelevance?: number;
    } = {}
  ): Promise<MemoryEntry[]> {
    if (!this.client) return [];

    const {
      limit = MEMORY_CONFIG.MAX_CONTEXT_MEMORIES,
      memoryTypes
    } = options;

    try {
      const simplifiedUserId = this.getSimplifiedUserId(userId);

      const requestBody = {
        query,
        user_id: simplifiedUserId,
        limit: limit,
        filters: {
          user_id: simplifiedUserId,
          ...(memoryTypes && memoryTypes.length > 0 ? {
            categories: { in: memoryTypes }
          } : {})
        }
      };

      console.log('Searching memories with request:', JSON.stringify(requestBody, null, 2));

      // Use POST request with correct format
      const response = await fetch('https://api.mem0.ai/v1/memories/search/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.MEM0_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to search memories:', response.status, errorText);
        return [];
      }

      const result = await response.json();

      interface Mem0SearchResult {
        id: string;
        memory: string;
        user_id: string;
        categories?: string[];
        created_at?: string;
        metadata?: {
          chat_id?: string;
          timestamp?: string;
          confidence?: number;
          source?: string;
          expires_at?: string;
        };
      }

      return (result as Mem0SearchResult[])
        ?.map((memory: Mem0SearchResult) => ({
          id: memory.id,
          content: memory.memory,
          userId: memory.user_id,
          relevanceScore: 1.0, // v2 API doesn't return scores
          metadata: {
            type: (memory.categories?.[0] as MemoryType) || MemoryType.CONVERSATION_CONTEXT,
            chatId: memory.metadata?.chat_id,
            timestamp: this.parseTimestamp(memory.created_at || memory.metadata?.timestamp),
            confidence: memory.metadata?.confidence || 0.8,
            source: memory.metadata?.source || 'mem0',
            tags: memory.categories || [],
            expiresAt: memory.metadata?.expires_at ? new Date(memory.metadata.expires_at) : undefined,
          },
        })) || [];
    } catch (error) {
      console.error('Failed to search memories:', error);
      return [];
    }
  }

  /**
   * Get all memories for a user
   */
  async getUserMemories(userId: string, limit: number = 100): Promise<MemoryEntry[]> {
    if (!this.client) return [];

    try {
      const simplifiedUserId = this.getSimplifiedUserId(userId);
      console.log('Fetching memories for simplified user_id:', simplifiedUserId, 'from original:', userId);

      // Use direct HTTP API call for consistency
      const response = await fetch(`https://api.mem0.ai/v1/memories/?user_id=${simplifiedUserId}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${process.env.MEM0_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch memories:', response.status, errorText);
        return [];
      }

      const result = await response.json();
      console.log('Raw memories response:', result);

      interface Mem0GetResult {
        id: string;
        memory?: string;
        data?: { memory?: string };
        user_id?: string;
        categories?: string[];
        created_at?: string;
        metadata?: {
          chat_id?: string;
          timestamp?: string;
          confidence?: number;
          source?: string;
          expires_at?: string;
        };
      }

      const memories = (result?.results || result || []).map((memory: Mem0GetResult) => ({
        id: memory.id,
        content: memory.memory || memory.data?.memory,
        userId,
        relevanceScore: 1.0,
        metadata: {
          type: (memory.categories?.[0] as MemoryType) || MemoryType.CONVERSATION_CONTEXT,
          chatId: memory.metadata?.chat_id,
          timestamp: this.parseTimestamp(memory.created_at || memory.metadata?.timestamp),
          confidence: memory.metadata?.confidence || 0.8,
          source: memory.metadata?.source || 'mem0',
          tags: memory.categories || [],
          expiresAt: memory.metadata?.expires_at ? new Date(memory.metadata.expires_at) : undefined,
        },
      }));

      console.log('Processed memories:', memories.length, memories);
      return memories;
    } catch (error) {
      console.error('Failed to get user memories:', error);
      return [];
    }
  }

  /**
   * Update an existing memory
   */
  async updateMemory(memoryId: string, content: string, metadata?: Partial<MemoryMetadata>): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.update(
        memoryId,
        {
          text: content,
          metadata: metadata ? {
            type: metadata.type,
            chat_id: metadata.chatId,
            timestamp: metadata.timestamp?.toISOString(),
            confidence: metadata.confidence,
            source: metadata.source,
            tags: metadata.tags?.join(','),
            expires_at: metadata.expiresAt?.toISOString(),
          } : undefined,
        }
      );

      return true;
    } catch (error) {
      console.error('Failed to update memory:', error);
      return false;
    }
  }

  /**
   * Delete a memory
   */
  async deleteMemory(memoryId: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.delete(memoryId);
      return true;
    } catch (error) {
      console.error('Failed to delete memory:', error);
      return false;
    }
  }

  /**
   * Extract memories from a message using pattern matching
   */
  extractMemoriesFromMessage(message: Message, userId: string, chatId: string): MemoryEntry[] {
    if (!MEMORY_CONFIG.EXTRACT_MEMORIES_FROM_MESSAGES) return [];
    if (message.content.length < MEMORY_CONFIG.MIN_MESSAGE_LENGTH_FOR_EXTRACTION) return [];
    if (message.role !== 'user') return []; // Only extract from user messages

    const memories: MemoryEntry[] = [];
    const content = message.content;

    console.log('Extracting memories from message:', content);

    // Check for user preferences
    for (const pattern of MEMORY_PATTERNS.USER_PREFERENCES) {
      if (pattern.test(content)) {
        memories.push({
          content: content,
          userId,
          metadata: {
            type: MemoryType.USER_PREFERENCE,
            chatId,
            timestamp: message.timestamp || new Date(),
            source: 'pattern_extraction',
            confidence: 0.8,
          },
        });
        break; // Only add one preference memory per message
      }
    }

    // Check for personal information
    for (const pattern of MEMORY_PATTERNS.PERSONAL_INFO) {
      if (pattern.test(content)) {
        memories.push({
          content: content,
          userId,
          metadata: {
            type: MemoryType.PERSONAL_INFO,
            chatId,
            timestamp: message.timestamp || new Date(),
            source: 'pattern_extraction',
            confidence: 0.9,
          },
        });
        break;
      }
    }

    // Check for factual knowledge
    for (const pattern of MEMORY_PATTERNS.FACTUAL_KNOWLEDGE) {
      if (pattern.test(content)) {
        memories.push({
          content: content,
          userId,
          metadata: {
            type: MemoryType.FACTUAL_KNOWLEDGE,
            chatId,
            timestamp: message.timestamp || new Date(),
            source: 'pattern_extraction',
            confidence: 0.7,
          },
        });
        break;
      }
    }

    // Check for behavioral patterns
    for (const pattern of MEMORY_PATTERNS.BEHAVIORAL_PATTERNS) {
      if (pattern.test(content)) {
        memories.push({
          content: content,
          userId,
          metadata: {
            type: MemoryType.BEHAVIORAL_PATTERN,
            chatId,
            timestamp: message.timestamp || new Date(),
            source: 'pattern_extraction',
            confidence: 0.75,
          },
        });
        break;
      }
    }

    console.log('Extracted memories:', memories.length);
    return memories;
  }

  /**
   * Get relevant context memories for a conversation
   */
  async getContextMemories(
    currentMessage: string, 
    userId: string, 
    chatId?: string
  ): Promise<MemoryEntry[]> {
    if (!MEMORY_CONFIG.ENHANCE_CONTEXT_WITH_MEMORIES) return [];

    // Search for relevant memories based on current message
    const relevantMemories = await this.searchMemories(currentMessage, userId, {
      limit: MEMORY_CONFIG.MAX_CONTEXT_MEMORIES,
      minRelevance: MEMORY_CONFIG.MIN_RELEVANCE_SCORE,
    });

    // Prioritize memories from the same chat
    if (chatId) {
      relevantMemories.sort((a, b) => {
        const aFromSameChat = a.metadata.chatId === chatId ? 1 : 0;
        const bFromSameChat = b.metadata.chatId === chatId ? 1 : 0;
        
        if (aFromSameChat !== bFromSameChat) {
          return bFromSameChat - aFromSameChat;
        }
        
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });
    }

    return relevantMemories;
  }

  /**
   * Clean up expired memories
   */
  async cleanupExpiredMemories(userId: string): Promise<number> {
    if (!MEMORY_CONFIG.AUTO_CLEANUP_ENABLED) return 0;

    const allMemories = await this.getUserMemories(userId);
    const now = new Date();
    let deletedCount = 0;

    for (const memory of allMemories) {
      const shouldDelete = memory.metadata.expiresAt && memory.metadata.expiresAt < now;
      
      if (shouldDelete && memory.id) {
        const deleted = await this.deleteMemory(memory.id);
        if (deleted) deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Check if Mem0 service is available
   */
  isAvailable(): boolean {
    return this.client !== null;
  }
}

// Export singleton instance
export const mem0Service = new Mem0Service();
