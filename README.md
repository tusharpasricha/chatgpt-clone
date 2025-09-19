# ChatGPT Clone

mongodb+srv://tusharpasricha:rYZBhnFVzDQDLDx6@cluster0.b5fb8bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

A pixel-perfect ChatGPT clone built with Next.js 15, React 19, and the Vercel AI SDK. Features real-time AI conversations with streaming responses, chat persistence, and a beautiful UI that matches the original ChatGPT interface.

## ✨ Features

- 🤖 **Real AI Integration** - Powered by OpenAI GPT-4o-mini
- 💬 **Streaming Responses** - Real-time message streaming
- 💾 **Chat Persistence** - Conversations saved to localStorage
- 🎨 **Pixel-Perfect UI** - Matches original ChatGPT design
- 📱 **Fully Responsive** - Works on desktop and mobile
- ⚡ **Fast & Modern** - Built with Next.js 15 and React 19
- 🔧 **TypeScript** - Full type safety throughout
- 🎯 **Clean Architecture** - Well-organized, maintainable code

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

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

   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
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
- **State Management**: React Context + useReducer
- **Icons**: Lucide React

### Project Structure

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
