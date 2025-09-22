import { randomUUID } from 'crypto';

/**
 * Service for generating UUIDs for chats and messages
 * This replaces the previous sequential counter system with proper UUIDs
 */
export class UUIDService {

  /**
   * Generate a UUID-formatted chat ID
   * @returns A UUID like "68d18863-66e8-832e-a5b9-5cd98d1c5319"
   */
  generateChatId(): string {
    return randomUUID();
  }

  /**
   * Generate a UUID-formatted message ID
   * @returns A UUID like "68d18863-66e8-832e-a5b9-5cd98d1c5319"
   */
  generateMessageId(): string {
    return randomUUID();
  }
}

// Export singleton instance
export const uuidService = new UUIDService();
