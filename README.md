# ChatGPT Clone

mongodb+srv://tusharpasricha:rYZBhnFVzDQDLDx6@cluster0.b5fb8bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

A pixel-perfect ChatGPT clone built with Next.js 15, React 19, and the Vercel AI SDK. Features real-time AI conversations with streaming responses, chat persistence, and a beautiful UI that matches the original ChatGPT interface.

## ✨ Features

- 🤖 **Real AI Integration** - Powered by OpenAI GPT-4o-mini
- 💬 **Streaming Responses** - Real-time message streaming
- 🧠 **Advanced Memory** - Mem0-powered long-term memory and context
- 💾 **Chat Persistence** - Conversations saved to MongoDB
- 🎨 **Pixel-Perfect UI** - Matches original ChatGPT design
- 📱 **Fully Responsive** - Works on desktop and mobile
- 📎 **File Uploads** - Support for images and documents
- ⚡ **Fast & Modern** - Built with Next.js 15 and React 19
- 🔧 **TypeScript** - Full type safety throughout
- 🎯 **Clean Architecture** - Well-organized, maintainable code

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

## 🧠 Advanced Memory Features

This ChatGPT clone includes sophisticated memory capabilities powered by **Mem0**:

### **Automatic Memory Creation**
- **User Preferences**: Remembers your likes, dislikes, and choices
- **Personal Information**: Stores important details about you
- **Behavioral Patterns**: Learns your habits and tendencies
- **Factual Knowledge**: Retains important facts you share
- **Conversation Context**: Maintains context across sessions

### **Memory Management**
- **Smart Categorization**: Automatically organizes memories by type
- **Relevance Scoring**: Prioritizes important memories
- **Search & Filter**: Find specific memories easily
- **Manual Control**: Add, edit, or delete memories as needed
- **Privacy Controls**: Full control over your memory data

### **Enhanced Conversations**
- **Personalized Responses**: AI adapts to your preferences
- **Context Continuity**: Seamless conversation flow across sessions
- **Learning Over Time**: Gets better at understanding you
- **Intelligent Recall**: Brings up relevant memories when needed

For detailed setup and usage instructions, see [MEM0_INTEGRATION.md](./MEM0_INTEGRATION.md).

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Mem0 Integration Guide](./MEM0_INTEGRATION.md) - detailed memory system documentation.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
