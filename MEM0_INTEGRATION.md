# Mem0 Integration - Advanced Memory Management

## 🧠 Overview

This ChatGPT clone now includes advanced memory capabilities powered by **Mem0**, providing sophisticated long-term memory, user preferences tracking, and contextual recall that enhances conversations over time.

## ✨ Features

### 🎯 **Advanced Memory Types**
- **User Preferences**: Likes, dislikes, and personal choices
- **Personal Information**: Name, work, location, and background
- **Factual Knowledge**: Important facts and information shared
- **Behavioral Patterns**: User habits and tendencies
- **Topic Expertise**: Areas of knowledge and interest
- **Conversation Context**: Important context from past conversations

### 🔄 **Automatic Memory Extraction**
- **Pattern Recognition**: Automatically detects and stores important information
- **Smart Categorization**: Classifies memories by type and relevance
- **Context Preservation**: Maintains conversation continuity across sessions
- **Relevance Scoring**: Prioritizes memories based on importance

### 🎛️ **Memory Management**
- **Search & Filter**: Find specific memories by content or type
- **Manual Addition**: Add custom memories for important information
- **Cleanup Tools**: Remove expired or irrelevant memories
- **Statistics Dashboard**: Track memory usage and patterns

## 🚀 Setup Instructions

### 1. **Get Mem0 API Key**
1. Visit [Mem0.ai](https://mem0.ai) and create an account
2. Navigate to your dashboard and generate an API key
3. Copy the API key for configuration

### 2. **Environment Configuration**
Add to your `.env.local` file:
```env
MEM0_API_KEY=your_mem0_api_key_here
```

### 3. **Verify Installation**
The integration is automatically enabled when a valid API key is provided. Check the console for any configuration warnings.

## 📚 Usage Guide

### **For Users**

#### **Automatic Memory Creation**
The system automatically creates memories when you:
- Express preferences: "I love Italian food"
- Share personal info: "I work as a software engineer"
- Mention facts: "Did you know that..."
- Describe habits: "I usually wake up early"

#### **Memory Manager Interface**
Access the Memory Manager to:
- View all your stored memories
- Search for specific information
- Add custom memories manually
- Clean up old or irrelevant memories
- View memory statistics

#### **Enhanced Conversations**
With memories enabled, the AI will:
- Remember your preferences across sessions
- Recall important personal information
- Build on previous conversations
- Provide more personalized responses

### **For Developers**

#### **Memory Service API**
```typescript
import { mem0Service } from '@/lib/memory/mem0-service';

// Add a memory
await mem0Service.addMemory({
  content: "User prefers dark mode",
  userId: "user123",
  metadata: {
    type: MemoryType.USER_PREFERENCE,
    chatId: "chat456",
    timestamp: new Date(),
    confidence: 0.9,
  }
});

// Search memories
const memories = await mem0Service.searchMemories(
  "dark mode preferences", 
  "user123"
);
```

#### **Enhanced Context Manager**
```typescript
import { enhancedContextManager } from '@/lib/memory/enhanced-context-manager';

// Prepare messages with memory context
const messages = await enhancedContextManager.prepareMessagesWithMemory(
  conversationMessages,
  systemPrompt,
  {
    userId: "user123",
    chatId: "chat456",
    includeMemories: true,
    maxMemories: 10,
  }
);
```

#### **React Hooks**
```typescript
import { useMemory } from '@/hooks/use-memory';

function MyComponent() {
  const {
    memories,
    searchMemories,
    addMemory,
    deleteMemory,
    stats
  } = useMemory();

  // Use memory functions in your component
}
```

## 🔧 API Endpoints

### **Memory Management**
- `GET /api/memory` - Get user memories
- `POST /api/memory` - Add new memory
- `GET /api/memory/[id]` - Get specific memory
- `PUT /api/memory/[id]` - Update memory
- `DELETE /api/memory/[id]` - Delete memory

### **Memory Statistics**
- `GET /api/memory/stats` - Get memory statistics
- `POST /api/memory/stats/cleanup` - Clean up expired memories

## 📊 Memory Types & Patterns

### **Automatic Detection Patterns**

#### **User Preferences**
- "I like/love/prefer/enjoy..."
- "My favorite ... is..."
- "I usually/always/never..."

#### **Personal Information**
- "My name is..."
- "I work as/at..."
- "I live in..."
- "I am ... years old"

#### **Factual Knowledge**
- "Did you know..."
- "The fact is..."
- "According to..."
- "Research shows..."

#### **Behavioral Patterns**
- "I tend to..."
- "I often..."
- "My habit is..."
- "I have a tendency..."

## ⚙️ Configuration Options

### **Memory Configuration**
```typescript
export const MEMORY_CONFIG = {
  MAX_CONTEXT_MEMORIES: 10,        // Max memories per context
  MIN_RELEVANCE_SCORE: 0.7,        // Minimum relevance threshold
  RETENTION_PERIODS: {             // Memory retention by type
    USER_PREFERENCE: 365,          // 1 year
    CONVERSATION_CONTEXT: 30,      // 1 month
    FACTUAL_KNOWLEDGE: 180,        // 6 months
    // ... more types
  },
  AUTO_CLEANUP_ENABLED: true,      // Enable automatic cleanup
  EXTRACT_MEMORIES_FROM_MESSAGES: true, // Auto-extract memories
};
```

### **Context Enhancement**
```typescript
const options = {
  includeMemories: true,           // Include memories in context
  memoryWeight: 0.3,              // Weight of memory context
  maxMemories: 10,                // Max memories per request
  minRelevance: 0.7,              // Minimum relevance score
};
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Memory Service Not Available**
- Check if `MEM0_API_KEY` is set in environment variables
- Verify API key is valid and active
- Check console for initialization errors

#### **Memories Not Being Created**
- Ensure `EXTRACT_MEMORIES_FROM_MESSAGES` is enabled
- Check if message content matches extraction patterns
- Verify user authentication is working

#### **Context Not Enhanced**
- Confirm `ENHANCE_CONTEXT_WITH_MEMORIES` is enabled
- Check if relevant memories exist for the conversation
- Verify memory relevance scores meet threshold

### **Debug Information**
Enable debug logging by checking browser console for:
- Memory extraction logs
- Context enhancement statistics
- API response details

## 🎯 Best Practices

### **For Optimal Memory Performance**
1. **Regular Cleanup**: Use cleanup tools to remove outdated memories
2. **Quality Over Quantity**: Focus on meaningful, relevant memories
3. **Proper Categorization**: Ensure memories are correctly typed
4. **Relevance Tuning**: Adjust relevance thresholds based on usage

### **Privacy Considerations**
1. **User Control**: Provide users with full control over their memories
2. **Data Retention**: Implement appropriate retention policies
3. **Secure Storage**: Ensure memories are securely stored and transmitted
4. **Transparency**: Make memory usage clear to users

## 📈 Performance Impact

### **Memory Usage**
- Minimal impact on conversation response time
- Efficient caching of frequently accessed memories
- Automatic cleanup of expired memories

### **Token Usage**
- Smart context management to optimize token usage
- Configurable memory limits to control costs
- Relevance-based filtering to include only useful memories

## 🔮 Future Enhancements

### **Planned Features**
- **Memory Clustering**: Group related memories automatically
- **Semantic Search**: Advanced search using embeddings
- **Memory Sharing**: Share memories between related conversations
- **Analytics Dashboard**: Detailed memory usage analytics
- **Export/Import**: Backup and restore memory data

---

**Built with ❤️ using Mem0 and Galaxy.ai Standards**

For more information, visit [Mem0 Documentation](https://docs.mem0.ai/)
