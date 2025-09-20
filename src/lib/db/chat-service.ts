import { getDatabase } from './mongodb';
import { DbChat, DbMessage, Chat, Message, dbChatToChat, chatToDbChat, messageToDbMessage } from './models';
import { Collection } from 'mongodb';

export class ChatService {
  private async getChatsCollection(): Promise<Collection<DbChat>> {
    const db = await getDatabase();
    return db.collection<DbChat>('chats');
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const collection = await this.getChatsCollection();
    const dbChats = await collection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    
    return dbChats.map(dbChatToChat);
  }

  async getChatById(chatId: string, userId: string): Promise<Chat | null> {
    const collection = await this.getChatsCollection();
    const dbChat = await collection.findOne({ id: chatId, userId });
    
    return dbChat ? dbChatToChat(dbChat) : null;
  }

  async createChat(chat: Chat, userId: string): Promise<Chat> {
    const collection = await this.getChatsCollection();
    const dbChat = chatToDbChat(chat, userId);
    
    await collection.insertOne(dbChat);
    return chat;
  }

  async updateChat(chatId: string, userId: string, updates: Partial<Chat>): Promise<Chat | null> {
    const collection = await this.getChatsCollection();

    const updateDoc: { updatedAt: Date; title?: string; messages?: DbMessage[]; isActive?: boolean } = {
      updatedAt: new Date(),
    };

    if (updates.title) updateDoc.title = updates.title;
    if (updates.messages) updateDoc.messages = updates.messages.map(messageToDbMessage);
    if (updates.isActive !== undefined) updateDoc.isActive = updates.isActive;

    const result = await collection.findOneAndUpdate(
      { id: chatId, userId },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result ? dbChatToChat(result) : null;
  }

  async addMessageToChat(chatId: string, userId: string, message: Message): Promise<Chat | null> {
    const collection = await this.getChatsCollection();
    const dbMessage = messageToDbMessage(message);

    const result = await collection.findOneAndUpdate(
      { id: chatId, userId },
      { 
        $push: { messages: dbMessage },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    return result ? dbChatToChat(result) : null;
  }

  async updateMessageInChat(
    chatId: string, 
    userId: string, 
    messageId: string, 
    updates: Partial<Message>
  ): Promise<Chat | null> {
    const collection = await this.getChatsCollection();

    const updateDoc: { [key: string]: string } = {};
    if (updates.content) updateDoc['messages.$.content'] = updates.content;
    if (updates.role) updateDoc['messages.$.role'] = updates.role;

    const result = await collection.findOneAndUpdate(
      { id: chatId, userId, 'messages.id': messageId },
      { 
        $set: {
          ...updateDoc,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return result ? dbChatToChat(result) : null;
  }

  async deleteChat(chatId: string, userId: string): Promise<boolean> {
    const collection = await this.getChatsCollection();
    const result = await collection.deleteOne({ id: chatId, userId });
    return result.deletedCount > 0;
  }

  async deleteAllUserChats(userId: string): Promise<number> {
    const collection = await this.getChatsCollection();
    const result = await collection.deleteMany({ userId });
    return result.deletedCount;
  }

  // Utility methods
  async getChatCount(userId: string): Promise<number> {
    const collection = await this.getChatsCollection();
    return collection.countDocuments({ userId });
  }

  async getRecentChats(userId: string, limit: number = 10): Promise<Chat[]> {
    const collection = await this.getChatsCollection();
    const dbChats = await collection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();
    
    return dbChats.map(dbChatToChat);
  }
}

// Export singleton instance
export const chatService = new ChatService();
