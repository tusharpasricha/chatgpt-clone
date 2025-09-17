/**
 * Mock chat data for the ChatGPT clone
 * In a real application, this would be replaced with API calls
 */

import { Chat } from '@/types';

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Casual greeting',
    messages: [],
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    title: 'New chat',
    messages: [],
    createdAt: new Date('2024-01-14T15:20:00Z'),
    updatedAt: new Date('2024-01-14T15:45:00Z'),
  },
  {
    id: '3',
    title: 'Next.js timeline overview',
    messages: [],
    createdAt: new Date('2024-01-13T09:15:00Z'),
    updatedAt: new Date('2024-01-13T09:45:00Z'),
  },
  {
    id: '4',
    title: 'Using earphones with Mac M2',
    messages: [],
    createdAt: new Date('2024-01-12T14:30:00Z'),
    updatedAt: new Date('2024-01-12T14:55:00Z'),
  },
  {
    id: '5',
    title: 'ARIA compliance details',
    messages: [],
    createdAt: new Date('2024-01-11T11:10:00Z'),
    updatedAt: new Date('2024-01-11T11:40:00Z'),
  },
  {
    id: '6',
    title: 'Excalidraw overview',
    messages: [],
    createdAt: new Date('2024-01-10T16:25:00Z'),
    updatedAt: new Date('2024-01-10T16:50:00Z'),
  },
  {
    id: '7',
    title: 'Include AI tools?',
    messages: [],
    createdAt: new Date('2024-01-09T13:45:00Z'),
    updatedAt: new Date('2024-01-09T14:10:00Z'),
  },
  {
    id: '8',
    title: 'Rephrasing resume experience',
    messages: [],
    createdAt: new Date('2024-01-08T10:20:00Z'),
    updatedAt: new Date('2024-01-08T10:55:00Z'),
  },
  {
    id: '9',
    title: 'Choosing a database decision',
    messages: [],
    createdAt: new Date('2024-01-07T15:30:00Z'),
    updatedAt: new Date('2024-01-07T16:00:00Z'),
  },
  {
    id: '10',
    title: 'Resume content insertion',
    messages: [],
    createdAt: new Date('2024-01-06T12:15:00Z'),
    updatedAt: new Date('2024-01-06T12:45:00Z'),
  },
  {
    id: '11',
    title: 'Adding personal touch to post',
    messages: [],
    createdAt: new Date('2024-01-05T09:40:00Z'),
    updatedAt: new Date('2024-01-05T10:10:00Z'),
  },
  {
    id: '12',
    title: 'Plagiarism check comparison',
    messages: [],
    createdAt: new Date('2024-01-04T14:55:00Z'),
    updatedAt: new Date('2024-01-04T15:25:00Z'),
  },
  {
    id: '13',
    title: 'Git story for LinkedIn',
    messages: [],
    createdAt: new Date('2024-01-03T11:30:00Z'),
    updatedAt: new Date('2024-01-03T12:00:00Z'),
  },
  {
    id: '14',
    title: 'LinkedIn post framework',
    messages: [],
    createdAt: new Date('2024-01-02T16:10:00Z'),
    updatedAt: new Date('2024-01-02T16:40:00Z'),
  },
  {
    id: '15',
    title: 'Most viewed Git article',
    messages: [],
    createdAt: new Date('2024-01-01T13:20:00Z'),
    updatedAt: new Date('2024-01-01T13:50:00Z'),
  },
];

/**
 * Get all chats sorted by most recent first
 */
export function getChats(): Chat[] {
  return MOCK_CHATS.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

/**
 * Get active chat
 */
export function getActiveChat(): Chat | undefined {
  return MOCK_CHATS.find(chat => chat.isActive);
}

/**
 * Get chat by ID
 */
export function getChatById(id: string): Chat | undefined {
  return MOCK_CHATS.find(chat => chat.id === id);
}
