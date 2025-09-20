# ChatGPT Clone - Complete Documentation

A pixel-perfect ChatGPT clone built with Next.js 15, React 19, and the Vercel AI SDK. Features real-time AI conversations with streaming responses, advanced memory management, file uploads, and a beautiful UI that matches the original ChatGPT interface.

## ✨ Features

- 🤖 **Real AI Integration** - Powered by OpenAI GPT-4o-mini
- 💬 **Streaming Responses** - Real-time message streaming
- 🧠 **Advanced Memory** - Mem0-powered long-term memory and context
- 💾 **Chat Persistence** - Conversations saved to MongoDB
- 🎨 **Pixel-Perfect UI** - Matches original ChatGPT design
- 📱 **Fully Responsive** - Works on desktop and mobile
- 📎 **File Uploads** - Support for images and documents via Uploadcare
- ⚡ **Fast & Modern** - Built with Next.js 15 and React 19
- 🔧 **TypeScript** - Full type safety throughout
- 🎯 **Clean Architecture** - Well-organized, maintainable code
- ✏️ **Message Editing** - Edit and update user messages
- 🔄 **Context Management** - Intelligent long-context handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- MongoDB database (Atlas recommended)
- Clerk account for authentication
- Mem0 API key (optional, for advanced memory features)
- Uploadcare account (optional, for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatgpt-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Optional (for advanced features)
   MEM0_API_KEY=your_mem0_api_key_here
   NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
   UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK + OpenAI
- **Memory System**: Mem0 for advanced memory management
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **File Storage**: Uploadcare
- **State Management**: React Context + useReducer
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── chat/              # Chat API endpoints
│   │   ├── memory/            # Memory management API
│   │   └── upload/            # File upload API
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── chat/                  # Chat-related components
│   ├── memory/                # Memory management UI
│   ├── ui/                    # Reusable UI components
│   └── layout/                # Layout components
├── contexts/
│   └── chat-context.tsx       # Chat state management
├── hooks/
│   ├── use-memory.ts          # Memory management hooks
│   └── use-chat.ts            # Chat-related hooks
├── lib/
│   ├── chat/                  # Chat utilities
│   ├── db/                    # Database models and utilities
│   ├── memory/                # Memory system integration
│   └── upload/                # File upload utilities
└── types/
    └── index.ts               # TypeScript type definitions
```

## 🧠 Advanced Memory Features (Mem0 Integration)

### Memory Types
- **User Preferences**: Likes, dislikes, and personal choices
- **Personal Information**: Name, work, location, and background
- **Behavioral Patterns**: User habits and tendencies
- **Factual Knowledge**: Important facts and information shared
- **Topic Expertise**: Areas of knowledge and interest
- **Conversation Context**: Important context from past conversations

### Automatic Memory Extraction
- **Pattern Recognition**: Automatically detects and stores important information
- **Smart Categorization**: Classifies memories by type and relevance
- **Context Preservation**: Maintains conversation continuity across sessions
- **Relevance Scoring**: Prioritizes memories based on importance

### Memory Management
- **Search & Filter**: Find specific memories by content or type
- **Manual Addition**: Add custom memories for important information
- **Cleanup Tools**: Remove expired or irrelevant memories
- **Statistics Dashboard**: Track memory usage and patterns

### Setup Instructions
1. Get Mem0 API key from [Mem0.ai](https://mem0.ai)
2. Add `MEM0_API_KEY=your_mem0_api_key_here` to `.env.local`
3. The integration is automatically enabled when a valid API key is provided

## 📎 File Upload System (Uploadcare Integration)

### Supported File Types
#### Images (with AI Vision)
- JPEG, PNG, GIF, WebP

#### Documents
- PDF, Word Documents (.doc, .docx)

#### Text Files
- Plain Text, CSV, JSON

### Upload Flow
1. **File Selection**: Click paperclip icon or drag & drop files
2. **Client Processing**: Files sent to `/api/upload` endpoint
3. **Uploadcare Upload**: Files uploaded directly to Uploadcare CDN
4. **Attachment Creation**: Secure URLs generated for message integration
5. **AI Integration**: Images processed with GPT-4o vision capabilities

### Configuration
- **Max file size**: 10MB per file
- **Storage**: Auto-stored on Uploadcare CDN
- **Delivery**: Global CDN with automatic optimization

## ⚙️ Advanced Features Implementation

### Message Editing System
- **Click-to-edit**: User messages can be edited inline
- **Real-time editing**: Textarea with save/cancel functionality
- **Optimistic updates**: Immediate UI feedback
- **Error handling**: State reversion on failures

### Context Management
- **Token estimation**: Intelligent token counting for messages and attachments
- **Context window management**: 4000 token limit with smart truncation
- **Message summarization**: Context preservation for long conversations
- **Vision model support**: Optimized for image attachments

### Chat Persistence
- **MongoDB integration**: All conversations saved to database
- **Attachment support**: File metadata stored with messages
- **Error recovery**: Robust error handling for database operations
- **Context statistics**: Monitoring and analytics

## 🔧 Configuration Options

### Memory Configuration
```typescript
export const MEMORY_CONFIG = {
  MAX_CONTEXT_MEMORIES: 10,        // Max memories per context
  MIN_RELEVANCE_SCORE: 0.7,        // Minimum relevance threshold
  RETENTION_PERIODS: {             // Memory retention by type
    USER_PREFERENCE: 365,          // 1 year
    CONVERSATION_CONTEXT: 30,      // 1 month
    FACTUAL_KNOWLEDGE: 180,        // 6 months
  },
  AUTO_CLEANUP_ENABLED: true,      // Enable automatic cleanup
  EXTRACT_MEMORIES_FROM_MESSAGES: true, // Auto-extract memories
};
```

### Context Management
```typescript
const contextOptions = {
  maxTokens: 4000,                 // Context window size
  reserveTokens: 1000,             // Reserved for responses
  summaryTokens: 500,              // For context summaries
  enableSummarization: true,       // Enable context summarization
};
```

## 🔍 API Endpoints

### Chat API
- `POST /api/chat` - Send message and get AI response

### Memory API
- `GET /api/memory` - Get user memories
- `POST /api/memory` - Add new memory
- `GET /api/memory/[id]` - Get specific memory
- `PUT /api/memory/[id]` - Update memory
- `DELETE /api/memory/[id]` - Delete memory
- `GET /api/memory/stats` - Get memory statistics

### Upload API
- `POST /api/upload` - Upload files to Uploadcare

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MEM0_API_KEY=your_mem0_api_key
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key
```

## 🔍 Troubleshooting

### Common Issues

#### Memory Service Not Available
- Check if `MEM0_API_KEY` is set in environment variables
- Verify API key is valid and active
- Check console for initialization errors

#### File Upload Issues
- Verify Uploadcare keys are correctly set
- Check file size limits (10MB max)
- Ensure supported file types

#### Chat Not Working
- Verify OpenAI API key is valid
- Check MongoDB connection string
- Ensure Clerk authentication is properly configured

### Debug Information
- Check browser console for detailed error messages
- Monitor network requests in developer tools
- Review server logs for API endpoint issues

## 📈 Performance Considerations

### Memory Usage
- Minimal impact on conversation response time
- Efficient caching of frequently accessed memories
- Automatic cleanup of expired memories

### Token Usage
- Smart context management to optimize token usage
- Configurable memory limits to control costs
- Relevance-based filtering to include only useful memories

### File Upload Performance
- Direct upload to Uploadcare CDN
- Automatic image optimization
- Global CDN delivery for fast access

## 🎯 Best Practices

### Memory Management
1. **Regular Cleanup**: Use cleanup tools to remove outdated memories
2. **Quality Over Quantity**: Focus on meaningful, relevant memories
3. **Proper Categorization**: Ensure memories are correctly typed
4. **Relevance Tuning**: Adjust relevance thresholds based on usage

### File Handling
1. **Size Optimization**: Compress large files before upload
2. **Type Validation**: Ensure files are supported types
3. **Security**: Validate file content on server side
4. **User Experience**: Provide clear upload progress feedback

### Performance Optimization
1. **Context Management**: Monitor token usage and optimize context size
2. **Database Queries**: Use efficient queries and indexing
3. **Caching**: Implement appropriate caching strategies
4. **Error Handling**: Provide graceful degradation for failures

---

**Built with ❤️ using Next.js, React, OpenAI, Mem0, and Uploadcare**

For more information:
- [Next.js Documentation](https://nextjs.org/docs)
- [Mem0 Documentation](https://docs.mem0.ai/)
- [Uploadcare Documentation](https://uploadcare.com/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
