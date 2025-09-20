/**
 * Mem0 Integration Tests
 * Tests for advanced memory management functionality
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { mem0Service } from '@/lib/memory/mem0-service';
import { MemoryType } from '@/lib/memory/mem0-config';
import { enhancedContextManager } from '@/lib/memory/enhanced-context-manager';
import { Message } from '@/types';

// Mock Mem0 client
jest.mock('mem0ai', () => ({
  MemoryClient: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'mock-memory-id' }),
    search: jest.fn().mockResolvedValue({
      results: [
        {
          id: 'memory-1',
          memory: 'User prefers dark mode',
          score: 0.9,
          metadata: {
            type: 'user_preference',
            timestamp: new Date().toISOString(),
          },
        },
      ],
    }),
    getAll: jest.fn().mockResolvedValue({
      results: [
        {
          id: 'memory-1',
          memory: 'User prefers dark mode',
          metadata: {
            type: 'user_preference',
            timestamp: new Date().toISOString(),
          },
        },
      ],
    }),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  })),
}));

// Mock environment variables
process.env.MEM0_API_KEY = 'test-api-key';

describe('Mem0 Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Memory Operations', () => {
    it('should add a memory successfully', async () => {
      const memoryEntry = {
        content: 'User likes coffee',
        userId: 'test-user',
        metadata: {
          type: MemoryType.USER_PREFERENCE,
          chatId: 'test-chat',
          timestamp: new Date(),
          confidence: 0.8,
          source: 'test',
        },
      };

      const memoryId = await mem0Service.addMemory(memoryEntry);
      expect(memoryId).toBe('mock-memory-id');
    });

    it('should search memories successfully', async () => {
      const memories = await mem0Service.searchMemories(
        'dark mode',
        'test-user',
        { limit: 5 }
      );

      expect(memories).toHaveLength(1);
      expect(memories[0].content).toBe('User prefers dark mode');
      expect(memories[0].relevanceScore).toBe(0.9);
    });

    it('should get user memories successfully', async () => {
      const memories = await mem0Service.getUserMemories('test-user');
      
      expect(memories).toHaveLength(1);
      expect(memories[0].content).toBe('User prefers dark mode');
    });

    it('should extract memories from user messages', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'I love Italian food and usually eat pasta on weekends',
        role: 'user',
        timestamp: new Date(),
      };

      const extractedMemories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(extractedMemories.length).toBeGreaterThan(0);
      expect(extractedMemories[0].metadata.type).toBe(MemoryType.USER_PREFERENCE);
    });
  });

  describe('Memory Pattern Extraction', () => {
    it('should extract user preferences', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'I prefer working in the morning',
        role: 'user',
        timestamp: new Date(),
      };

      const memories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(memories).toHaveLength(1);
      expect(memories[0].metadata.type).toBe(MemoryType.USER_PREFERENCE);
    });

    it('should extract personal information', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'My name is John and I work as a developer',
        role: 'user',
        timestamp: new Date(),
      };

      const memories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(memories).toHaveLength(1);
      expect(memories[0].metadata.type).toBe(MemoryType.PERSONAL_INFO);
    });

    it('should extract behavioral patterns', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'I tend to work late at night',
        role: 'user',
        timestamp: new Date(),
      };

      const memories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(memories).toHaveLength(1);
      expect(memories[0].metadata.type).toBe(MemoryType.BEHAVIORAL_PATTERN);
    });

    it('should not extract memories from short messages', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'Yes',
        role: 'user',
        timestamp: new Date(),
      };

      const memories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(memories).toHaveLength(0);
    });

    it('should not extract memories from assistant messages', () => {
      const message: Message = {
        id: 'msg-1',
        content: 'I understand you prefer working in the morning',
        role: 'assistant',
        timestamp: new Date(),
      };

      const memories = mem0Service.extractMemoriesFromMessage(
        message,
        'test-user',
        'test-chat'
      );

      expect(memories).toHaveLength(0);
    });
  });
});

describe('Enhanced Context Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Context Enhancement', () => {
    it('should prepare messages with memory context', async () => {
      const messages: Message[] = [
        {
          id: 'msg-1',
          content: 'What should I have for breakfast?',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      const enhancedMessages = await enhancedContextManager.prepareMessagesWithMemory(
        messages,
        undefined,
        {
          userId: 'test-user',
          chatId: 'test-chat',
          includeMemories: true,
          maxTokens: 4000,
          reserveTokensForResponse: 1000,
          summaryTokens: 500,
          model: 'gpt-3.5-turbo',
        }
      );

      expect(enhancedMessages.length).toBeGreaterThan(messages.length);
      // Should include memory context
      expect(enhancedMessages.some(msg => 
        msg.role === 'system' && 
        typeof msg.content === 'string' && 
        msg.content.includes('Relevant memories')
      )).toBe(true);
    });

    it('should get enhanced context window', async () => {
      const messages: Message[] = [
        {
          id: 'msg-1',
          content: 'Tell me about my preferences',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      const contextWindow = await enhancedContextManager.getEnhancedContextWindow(
        messages,
        'test-user',
        'test-chat',
        { includeMemories: true }
      );

      expect(contextWindow.messages).toEqual(messages);
      expect(contextWindow.memories).toBeDefined();
      expect(contextWindow.totalTokens).toBeGreaterThan(0);
    });

    it('should get memory statistics', async () => {
      const stats = await enhancedContextManager.getMemoryStats('test-user');

      expect(stats.totalMemories).toBe(1);
      expect(stats.memoriesByType).toBeDefined();
    });
  });

  describe('Memory Service Availability', () => {
    it('should check if memory service is available', () => {
      const isAvailable = enhancedContextManager.isMemoryAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });
  });
});

describe('Memory Configuration', () => {
  it('should have correct memory type labels', () => {
    expect(MemoryType.USER_PREFERENCE).toBe('user_preference');
    expect(MemoryType.PERSONAL_INFO).toBe('personal_info');
    expect(MemoryType.BEHAVIORAL_PATTERN).toBe('behavioral_pattern');
    expect(MemoryType.FACTUAL_KNOWLEDGE).toBe('factual_knowledge');
  });

  it('should validate memory patterns', async () => {
    const { MEMORY_PATTERNS } = await import('@/lib/memory/mem0-config');

    expect(MEMORY_PATTERNS.USER_PREFERENCES).toBeDefined();
    expect(MEMORY_PATTERNS.PERSONAL_INFO).toBeDefined();
    expect(MEMORY_PATTERNS.BEHAVIORAL_PATTERNS).toBeDefined();
    expect(MEMORY_PATTERNS.FACTUAL_KNOWLEDGE).toBeDefined();
  });
});

describe('Integration Edge Cases', () => {
  it('should handle missing API key gracefully', async () => {
    // Temporarily remove API key
    const originalKey = process.env.MEM0_API_KEY;
    delete process.env.MEM0_API_KEY;

    const { validateMem0Config } = await import('@/lib/memory/mem0-config');
    expect(validateMem0Config()).toBe(false);

    // Restore API key
    process.env.MEM0_API_KEY = originalKey;
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    const mockClient = {
      add: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    
    jest.doMock('mem0ai', () => ({
      MemoryClient: jest.fn().mockImplementation(() => mockClient),
    }));

    const memoryEntry = {
      content: 'Test memory',
      userId: 'test-user',
      metadata: {
        type: MemoryType.USER_PREFERENCE,
        chatId: 'test-chat',
        timestamp: new Date(),
      },
    };

    const result = await mem0Service.addMemory(memoryEntry);
    expect(result).toBeNull();
  });
});
