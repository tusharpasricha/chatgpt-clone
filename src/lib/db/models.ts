import { ObjectId } from 'mongodb';

// Database Models
export interface DbAttachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  size: number;
  mimeType: string;
  cloudinaryId?: string; // For Cloudinary integration
}

export interface DbMessage {
  _id?: ObjectId;
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  attachments?: DbAttachment[];
  metadata?: {
    model?: string;
    tokens?: number;
    finishReason?: string;
  };
}

export interface DbChat {
  _id?: ObjectId;
  id: string;
  title: string;
  userId: string; // For when we add authentication
  messages: DbMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  metadata?: {
    model?: string;
    totalTokens?: number;
    messageCount?: number;
  };
}

// API Types (what we send to frontend)
export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  size: number;
  mimeType: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

// Conversion utilities
export function dbChatToChat(dbChat: DbChat): Chat {
  return {
    id: dbChat.id,
    title: dbChat.title,
    messages: dbChat.messages.map(dbMessageToMessage),
    createdAt: dbChat.createdAt,
    updatedAt: dbChat.updatedAt,
    isActive: dbChat.isActive,
  };
}

export function dbMessageToMessage(dbMessage: DbMessage): Message {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    role: dbMessage.role,
    timestamp: dbMessage.timestamp,
    attachments: dbMessage.attachments?.map(dbAttachmentToAttachment),
  };
}

export function dbAttachmentToAttachment(dbAttachment: DbAttachment): Attachment {
  return {
    id: dbAttachment.id,
    name: dbAttachment.name,
    type: dbAttachment.type,
    url: dbAttachment.url,
    size: dbAttachment.size,
    mimeType: dbAttachment.mimeType,
  };
}

export function chatToDbChat(chat: Chat, userId: string): DbChat {
  return {
    id: chat.id,
    title: chat.title,
    userId,
    messages: chat.messages.map(messageToDbMessage),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    isActive: chat.isActive,
  };
}

export function messageToDbMessage(message: Message): DbMessage {
  return {
    id: message.id,
    content: message.content,
    role: message.role,
    timestamp: message.timestamp,
    attachments: message.attachments?.map(attachmentToDbAttachment),
  };
}

export function attachmentToDbAttachment(attachment: Attachment): DbAttachment {
  return {
    id: attachment.id,
    name: attachment.name,
    type: attachment.type,
    url: attachment.url,
    size: attachment.size,
    mimeType: attachment.mimeType,
  };
}
