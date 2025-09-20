# ChatGPT Clone

A pixel-perfect ChatGPT clone built with Next.js 15, React 19, and the Vercel AI SDK. Features real-time AI conversations with streaming responses, advanced memory management, file uploads, and a beautiful UI that matches the original ChatGPT interface.

## ✨ Key Features

- 🤖 **Real AI Integration** - Powered by OpenAI GPT-4o-mini
- 💬 **Streaming Responses** - Real-time message streaming
- 🧠 **Advanced Memory** - Mem0-powered long-term memory and context
- 💾 **Chat Persistence** - Conversations saved to MongoDB
- 📎 **File Uploads** - Support for images and documents via Uploadcare
- ✏️ **Message Editing** - Edit and update user messages
- 🎨 **Pixel-Perfect UI** - Matches original ChatGPT design
- 📱 **Fully Responsive** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatgpt-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure your environment** (see Environment Setup below)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration (Required)
MONGODB_URI=your_mongodb_connection_string

# Authentication Configuration (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Optional Environment Variables

Add these for enhanced features:

```env
# Memory Management (Optional - enables Mem0 integration)
MEM0_API_KEY=your_mem0_api_key_here

# File Upload (Optional - enables file upload functionality)
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key
```

## 🔑 Getting API Keys

### 1. OpenAI API Key (Required)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### 2. MongoDB Database (Required)
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `<password>` with your database user password
5. Add the connection string to your `.env.local` file

### 3. Clerk Authentication (Required)
1. Visit [Clerk](https://clerk.com/)
2. Create an account and new application
3. Copy the publishable key and secret key from the dashboard
4. Add both keys to your `.env.local` file

### 4. Mem0 API Key (Optional)
1. Visit [Mem0.ai](https://mem0.ai)
2. Create an account
3. Generate an API key from your dashboard
4. Add the key to your `.env.local` file

**Benefits**: Enables advanced memory management, user preferences tracking, and contextual recall across conversations.

### 5. Uploadcare Keys (Optional)
1. Visit [Uploadcare](https://uploadcare.com/)
2. Create an account
3. Get your public and secret keys from the dashboard
4. Add both keys to your `.env.local` file

**Benefits**: Enables file upload functionality for images and documents with CDN delivery.

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── .env.local              # Environment variables
├── README.md               # This file
└── DOCUMENTATION.md        # Detailed documentation
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import your repository in [Vercel](https://vercel.com)

2. **Add Environment Variables**
   - Go to your project settings in Vercel
   - Add all environment variables from your `.env.local` file
   - Deploy your application

3. **Custom Domain (Optional)**
   - Add your custom domain in Vercel project settings
   - Update DNS records as instructed

### Other Deployment Options

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

## 🔍 Troubleshooting

### Common Issues

**"OpenAI API key not found"**
- Ensure `OPENAI_API_KEY` is set in your `.env.local` file
- Verify the API key is valid and has sufficient credits

**"Database connection failed"**
- Check your `MONGODB_URI` connection string
- Ensure your IP address is whitelisted in MongoDB Atlas
- Verify database user credentials

**"Authentication not working"**
- Confirm both Clerk keys are correctly set
- Check that your domain is added to Clerk's allowed origins

**"File uploads not working"**
- Verify Uploadcare keys are set (if using file uploads)
- Check file size limits (10MB max)
- Ensure file types are supported

### Getting Help

- Check the [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed technical information
- Review the console for error messages
- Ensure all required environment variables are set

## 📚 Documentation

For detailed technical documentation, API references, and advanced configuration options, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT API
- [Vercel](https://vercel.com/) for the AI SDK and hosting platform
- [Mem0](https://mem0.ai/) for advanced memory management
- [Uploadcare](https://uploadcare.com/) for file upload and CDN services
- [Clerk](https://clerk.com/) for authentication services

---

**Ready to start chatting with AI? Follow the setup guide above and you'll be up and running in minutes!** 🚀
