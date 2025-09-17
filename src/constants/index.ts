/**
 * Application constants
 * Following Galaxy.ai standards for maintainable configuration
 */

// App metadata
export const APP_CONFIG = {
  name: 'ChatGPT Clone',
  description: 'A pixel-perfect ChatGPT clone built with Next.js 15',
  version: '1.0.0',
  author: 'Galaxy.ai',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// API endpoints
export const API_ROUTES = {
  CHAT: '/api/chat',
  MESSAGES: '/api/messages',
  UPLOAD: '/api/upload',
  CHATS: '/api/chats',
} as const;

// UI constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 260,
  HEADER_HEIGHT: 60,
  MESSAGE_MAX_WIDTH: 768,
  ANIMATION_DURATION: 200,
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: [
    'text/plain',
    'text/markdown',
    'application/pdf',
    'application/json',
    'text/csv',
  ],
} as const;

// Chat settings
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_MESSAGES_PER_CHAT: 100,
  AUTO_SAVE_DELAY: 1000, // ms
  TYPING_INDICATOR_DELAY: 500, // ms
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chatgpt-clone-history',
  USER_PREFERENCES: 'chatgpt-clone-preferences',
  CURRENT_CHAT: 'chatgpt-clone-current-chat',
  THEME: 'chatgpt-clone-theme',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'File type not supported.',
  MESSAGE_TOO_LONG: 'Message is too long. Please shorten it.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  CHAT_SAVED: 'Chat saved successfully',
  CHAT_DELETED: 'Chat deleted successfully',
} as const;

// Theme configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_CHAT: 'cmd+shift+o',
  SEND_MESSAGE: 'cmd+enter',
  FOCUS_INPUT: 'cmd+l',
  TOGGLE_SIDEBAR: 'cmd+shift+s',
} as const;
