/**
 * AI SDK Configuration
 * Vercel AI SDK setup with multiple providers
 */

import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Validate environment variables
const requiredEnvVars = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
}

// AI Model configurations
export const AI_MODELS = {
  'gpt-4': openai('gpt-4-turbo-preview'),
  'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
  'claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
} as const;

export type AIModelKey = keyof typeof AI_MODELS;

// Default settings
export const DEFAULT_AI_SETTINGS = {
  model: 'gpt-4' as AIModelKey,
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.',
};

// Context window limits for different models
export const CONTEXT_LIMITS = {
  'gpt-4': 128000,
  'gpt-3.5-turbo': 16385,
  'claude-3-sonnet': 200000,
} as const;

/**
 * Get AI model instance by key
 */
export function getAIModel(modelKey: AIModelKey = 'gpt-4') {
  return AI_MODELS[modelKey];
}

/**
 * Calculate token count (approximate)
 * This is a rough estimation - for production use a proper tokenizer
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

/**
 * Check if messages fit within context window
 */
export function checkContextLimit(
  messages: string[],
  modelKey: AIModelKey = 'gpt-4'
): boolean {
  const totalTokens = messages.reduce(
    (sum, message) => sum + estimateTokenCount(message),
    0
  );
  return totalTokens <= CONTEXT_LIMITS[modelKey];
}

/**
 * Truncate messages to fit context window
 */
export function truncateToContextLimit(
  messages: string[],
  modelKey: AIModelKey = 'gpt-4'
): string[] {
  const limit = CONTEXT_LIMITS[modelKey];
  const result: string[] = [];
  let totalTokens = 0;

  // Start from the most recent messages
  for (let i = messages.length - 1; i >= 0; i--) {
    const messageTokens = estimateTokenCount(messages[i]);
    if (totalTokens + messageTokens <= limit) {
      result.unshift(messages[i]);
      totalTokens += messageTokens;
    } else {
      break;
    }
  }

  return result;
}
