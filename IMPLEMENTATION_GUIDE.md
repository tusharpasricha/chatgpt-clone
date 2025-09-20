# ChatGPT Clone - Implementation Guide
*Following Galaxy.ai Technical Standards & Best Practices*

## 🎯 Project Overview

This guide provides a comprehensive roadmap for building a pixel-perfect ChatGPT clone that demonstrates engineering excellence and follows Galaxy.ai's mandatory technical standards. The final product will include:

- **Pixel-perfect UI/UX** matching ChatGPT exactly using v0.dev
- **Vercel AI SDK integration** for chat responses
- **Advanced chat memory** with MongoDB persistence
- **File & image upload support** via Uploadcare
- **Message editing & regeneration** with seamless UX
- **Long-context handling** with smart context window management
- **Mobile responsiveness** and accessibility compliance
- **Production-ready deployment** on Vercel following Next.js best practices

## 🏛️ Galaxy.ai Philosophy Integration

This implementation follows Galaxy.ai's core values:
- **Lean and Efficient Operations**: Minimal setup, maximum productivity
- **Innovation Over Process**: Focus on shipping great products
- **No Hand-Holding**: Independent development with clear standards
- **High-Quality Standards**: Production-ready code from day one

## 🏗️ Architecture Overview
*Built with Galaxy.ai Mandatory Tech Stack*

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js 15)  │◄──►│   (Next.js API) │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • v0.dev UI     │    │ • Chat API      │    │ • Vercel AI SDK │
│ • ShadCN/UI     │    │ • File Upload   │    │ • MongoDB       │
│ • TailwindCSS   │    │ • Clerk Auth    │    │ • Uploadcare    │
│ • TypeScript    │    │ • Context Mgmt  │    │ • Uploadcare    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Next.js 15 Key Features for ChatGPT Clone

**Latest Features We'll Leverage:**
- **React 19 Support**: Enhanced performance and new hooks
- **Async Request APIs**: Better server-side rendering optimization
- **Turbopack Dev (Stable)**: 76% faster local server startup
- **Enhanced Forms**: Built-in form handling with client-side navigation
- **Improved Caching**: Better control over caching semantics
- **TypeScript Config Support**: `next.config.ts` with type safety
- **Enhanced Security**: Improved Server Actions security

## 📚 Required Study Materials

**MANDATORY**: Before starting implementation, thoroughly study:
- [Dub GitHub Repository](https://github.com/dubinc/dub) - Reference for coding standards
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15) - Latest features and changes
- [Next.js Best Practices](https://nextjs.org/docs) - Production-ready patterns
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production) - Deployment standards

## 📋 Implementation Phases

### Phase 1: Project Foundation
- [x] Project setup with Next.js 14 + TypeScript
- [x] Development environment configuration
- [x] Project structure and folder organization
- [x] Core dependencies installation

### Phase 2: UI/UX Development
- [ ] Pixel-perfect ChatGPT interface replication
- [ ] Responsive design implementation
- [ ] Component library creation
- [ ] Animation and interaction patterns

### Phase 3: Core Chat Features
- [ ] Vercel AI SDK integration
- [ ] Message streaming implementation
- [ ] Real-time UI updates
- [ ] Context window management

### Phase 4: Advanced Features
- [ ] Message editing system
- [ ] File upload functionality
- [ ] Chat memory and persistence
- [ ] Long-context handling

### Phase 5: Backend & Integration
- [ ] MongoDB integration
- [ ] Uploadcare file storage
- [ ] API endpoint development
- [ ] Webhook support

### Phase 6: Testing & Deployment
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Vercel deployment
- [ ] Production monitoring

## 🛠️ Mandatory Technology Stack
*Galaxy.ai Required Tools - Non-Negotiable*

### Core Framework & Language
- **Framework**: Next.js 15 with App Router (mandatory)
- **Language**: TypeScript with strict mode (preferred)
- **Editor**: Cursor AI-powered code editor (mandatory)

### UI/UX & Styling
- **UI Design**: v0.dev for AI-powered UI/UX generation (mandatory)
- **Component Library**: ShadCN/UI (mandatory)
- **Styling**: TailwindCSS (mandatory)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend & Database
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose (mandatory)
- **File Storage**: Uploadcare (optional)
- **File Upload**: Uploadcare front-end components (mandatory)
- **Authentication**: Clerk (mandatory)
- **AI Integration**: Vercel AI SDK

### Development & Deployment
- **Package Manager**: pnpm (recommended)
- **Hosting**: Vercel (mandatory)
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
chatgpt-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── chat/             # Chat-specific components
│   │   ├── layout/           # Layout components
│   │   └── common/           # Shared components
│   ├── lib/                  # Utility libraries
│   │   ├── ai/              # AI SDK configuration
│   │   ├── db/              # Database utilities
│   │   ├── upload/          # File upload utilities
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management
│   ├── types/               # TypeScript definitions
│   └── constants/           # App constants
├── public/                  # Static assets
├── docs/                   # Documentation
├── tests/                  # Test files
└── config files           # Various config files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Cursor AI editor installed
- MongoDB database (Atlas recommended)
- Uploadcare account (optional)
- Uploadcare account
- Clerk account for authentication
- OpenAI API key
- Vercel account

### Environment Variables
Create a `.env.local` file with:
```env
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
VERCEL_AI_SDK_API_KEY=your_vercel_ai_key

# Database
MONGODB_URI=your_mongodb_connection_string

# File Upload & Storage
UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 Galaxy.ai Coding Standards
*Mandatory Requirements - Non-Compliance = Rejection*

### General Coding Practices
- **Next.js Best Practices**: Follow [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- **Clean Code**: Readable, modular code with consistent naming conventions
- **TypeScript Strict Mode**: Use strict type-checking to prevent runtime errors
- **Documentation**: Clear comments for complex logic, JSDoc for functions
- **File Organization**: Logical structure following Dub repository patterns

### UI/UX Standards
- **v0.dev Generated**: All UI components must be generated using v0.dev
- **ShadCN Components**: Use ShadCN/UI for consistent design system
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Accessibility**: ARIA-compliant components, keyboard navigation
- **Performance**: Optimized images, lazy loading, minimal bundle size

### Code Quality Requirements
- **Self-Review First**: Test thoroughly before submission
- **Edge Cases**: Handle loading states, errors, empty states
- **Type Safety**: No `any` types, proper interface definitions
- **Error Handling**: Graceful error boundaries and user feedback
- **Testing**: Unit tests for critical functionality

### Submission Standards
⚠️ **WARNING**: Submissions not meeting these standards will be rejected outright.

## 📖 Detailed Implementation Steps

Each phase includes:
- ✅ **Acceptance Criteria**: Clear success metrics aligned with Galaxy.ai standards
- 🔧 **Implementation Details**: Step-by-step instructions following best practices
- 🧪 **Testing Guidelines**: Comprehensive testing approach
- 📝 **Code Examples**: Reference implementations from Dub repository patterns
- 🐛 **Common Issues**: Troubleshooting guide and anti-patterns to avoid

## 🔄 Development Workflow

### 1. Feature Development Process
1. **Research Phase**: Study existing implementations and best practices
2. **Design Phase**: Create UI mockups using v0.dev
3. **Implementation Phase**: Code following Galaxy.ai standards
4. **Testing Phase**: Comprehensive testing including edge cases
5. **Review Phase**: Self-review and optimization
6. **Integration Phase**: Merge with main codebase

### 2. Quality Assurance Checklist
- [ ] Code follows Next.js best practices
- [ ] TypeScript strict mode compliance
- [ ] Responsive design tested on multiple devices
- [ ] Accessibility standards met (WCAG 2.1)
- [ ] Performance optimized (Core Web Vitals)
- [ ] Error handling implemented
- [ ] Loading states designed
- [ ] Edge cases covered

### 3. Testing Strategy
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database interaction testing
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load testing and optimization
- **Accessibility Tests**: Screen reader and keyboard navigation testing

## 🚨 Critical Success Factors

### Must-Have Features
1. **Pixel-Perfect UI**: Exact ChatGPT interface replication
2. **Real-time Streaming**: Smooth message streaming experience
3. **Context Management**: Intelligent conversation context handling
4. **File Upload**: Seamless file and image upload functionality
5. **Mobile Responsive**: Perfect mobile experience
6. **Performance**: Fast loading and smooth interactions

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3s

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: All components must meet accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Clear focus indicators and logical tab order

## 📚 Additional Resources

### Documentation Links
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Guide](https://sdk.vercel.ai/docs)
- [ShadCN/UI Components](https://ui.shadcn.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Best Practices](https://www.mongodb.com/developer/products/mongodb/mongodb-best-practices/)

### Reference Implementations
- [Dub.co Repository](https://github.com/dubinc/dub) - Code quality reference
- [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot) - AI integration patterns
- [ShadCN/UI Examples](https://github.com/shadcn-ui/ui) - Component implementations

---

**Built with ❤️ following Galaxy.ai Technical Standards**

*This implementation guide ensures production-ready code that meets the highest industry standards while leveraging cutting-edge technologies for optimal performance and user experience.*
