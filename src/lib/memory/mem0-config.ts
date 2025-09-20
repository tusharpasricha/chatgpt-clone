/**
 * Mem0 Configuration for Advanced Memory Management
 * Integrates Mem0's sophisticated memory capabilities with ChatGPT Clone
 */

import { MemoryClient } from 'mem0ai';

// Mem0 Configuration Interface
export interface Mem0Config {
  apiKey: string;
  userId?: string;
  organizationId?: string;
  projectId?: string;
  version?: string;
}

// Memory Types for different use cases
export enum MemoryType {
  USER_PREFERENCE = 'user_preference',
  CONVERSATION_CONTEXT = 'conversation_context',
  FACTUAL_KNOWLEDGE = 'factual_knowledge',
  BEHAVIORAL_PATTERN = 'behavioral_pattern',
  TOPIC_EXPERTISE = 'topic_expertise',
  PERSONAL_INFO = 'personal_info',
}

// Memory Metadata Interface
export interface MemoryMetadata {
  type: MemoryType;
  chatId?: string;
  timestamp: Date;
  confidence?: number;
  source?: string;
  tags?: string[];
  expiresAt?: Date;
}

// Memory Entry Interface
export interface MemoryEntry {
  id?: string;
  content: string;
  metadata: MemoryMetadata;
  userId: string;
  relevanceScore?: number;
}

// Mem0 Client Configuration
const MEM0_CONFIG: Mem0Config = {
  apiKey: process.env.MEM0_API_KEY || '',
  version: 'v1',
};

// Validate Mem0 configuration
export function validateMem0Config(): boolean {
  // Only validate on server side
  if (typeof window !== 'undefined') {
    return false; // Client side - disable Mem0
  }

  if (!MEM0_CONFIG.apiKey) {
    console.warn('MEM0_API_KEY not found in environment variables');
    return false;
  }
  return true;
}

// Initialize Mem0 Client
let mem0Client: MemoryClient | null = null;

export function getMem0Client(): MemoryClient | null {
  if (!validateMem0Config()) {
    return null;
  }

  if (!mem0Client) {
    try {
      mem0Client = new MemoryClient({
        apiKey: MEM0_CONFIG.apiKey,
      });
    } catch (error) {
      console.error('Failed to initialize Mem0 client:', error);
      return null;
    }
  }

  return mem0Client;
}

// Memory Configuration Options
export const MEMORY_CONFIG = {
  // Maximum number of memories to retrieve for context
  MAX_CONTEXT_MEMORIES: 10,
  
  // Minimum relevance score for memory inclusion
  MIN_RELEVANCE_SCORE: 0.7,
  
  // Memory retention periods (in days)
  RETENTION_PERIODS: {
    [MemoryType.USER_PREFERENCE]: 365, // 1 year
    [MemoryType.CONVERSATION_CONTEXT]: 30, // 1 month
    [MemoryType.FACTUAL_KNOWLEDGE]: 180, // 6 months
    [MemoryType.BEHAVIORAL_PATTERN]: 90, // 3 months
    [MemoryType.TOPIC_EXPERTISE]: 180, // 6 months
    [MemoryType.PERSONAL_INFO]: 365, // 1 year
  },
  
  // Auto-cleanup settings
  AUTO_CLEANUP_ENABLED: true,
  CLEANUP_INTERVAL_HOURS: 24,
  
  // Memory extraction settings
  EXTRACT_MEMORIES_FROM_MESSAGES: true,
  MIN_MESSAGE_LENGTH_FOR_EXTRACTION: 20,
  
  // Context enhancement settings
  ENHANCE_CONTEXT_WITH_MEMORIES: true,
  MEMORY_CONTEXT_WEIGHT: 0.3,
} as const;

// Memory extraction patterns
export const MEMORY_PATTERNS = {
  USER_PREFERENCES: [
    /I (like|love|prefer|enjoy|hate|dislike|really like)/i,
    /My favorite .* is/i,
    /I usually/i,
    /I always/i,
    /I never/i,
    /remember this/i,
    /please remember/i,
  ],

  PERSONAL_INFO: [
    /My name is/i,
    /I am .* years old/i,
    /I work (as|at)/i,
    /I am a .* (engineer|developer|designer|manager|student|teacher)/i,
    /I am an? (engineer|developer|designer|manager|student|teacher)/i,
    /I live in/i,
    /I study/i,
  ],
  
  FACTUAL_KNOWLEDGE: [
    /Did you know/i,
    /The fact is/i,
    /According to/i,
    /Research shows/i,
    /Studies indicate/i,
  ],
  
  BEHAVIORAL_PATTERNS: [
    /I tend to/i,
    /I often/i,
    /I typically/i,
    /My habit is/i,
    /I have a tendency/i,
  ],
} as const;

export default MEM0_CONFIG;
