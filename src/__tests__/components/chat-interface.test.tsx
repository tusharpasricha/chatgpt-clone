import { render, screen } from '@testing-library/react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Chat } from '@/types';

// Mock the chat context with a variable we can modify
let mockActiveChat: Chat | null = null;

const mockChatContext = {
  get activeChat() { return mockActiveChat; },
  chats: [],
  isLoading: false,
  isLoadingChats: false,
  error: null,
  createNewChat: jest.fn(),
  selectChat: jest.fn(),
  deleteChat: jest.fn(),
  sendMessage: jest.fn(),
  regenerateResponse: jest.fn(),
  updateChatTitle: jest.fn(),
  updateMessage: jest.fn(),
};

jest.mock('@/contexts/chat-context', () => ({
  useChat: () => mockChatContext,
  ChatProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the sidebar components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarInset: ({ children, className }: { children: React.ReactNode; className?: string }) => 
    <div className={className}>{children}</div>,
}));

jest.mock('@/components/chat/chatgpt-sidebar', () => ({
  ChatGPTSidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('@/components/chat/chat-header', () => ({
  ChatHeader: () => <div data-testid="chat-header">Chat Header</div>,
}));

jest.mock('@/components/chat/message-list', () => ({
  MessageList: () => <div data-testid="message-list">Message List</div>,
}));

jest.mock('@/components/chat/message-input', () => ({
  MessageInput: () => <div data-testid="message-input">Message Input</div>,
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockActiveChat = null; // Reset to welcome state
  });

  it('renders welcome state when no active chat', () => {
    render(<ChatInterface />);

    // Should show welcome message
    expect(screen.getByText("What's on the agenda today?")).toBeInTheDocument();

    // Should show centered input
    expect(screen.getByTestId('message-input')).toBeInTheDocument();

    // Should show header and sidebar
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // Should NOT show message list in welcome state
    expect(screen.queryByTestId('message-list')).not.toBeInTheDocument();
  });

  it('renders normal chat layout when there is an active chat', () => {
    // Set up active chat
    mockActiveChat = {
      id: 'test-chat-1',
      title: 'Test Chat',
      messages: [
        {
          id: 'msg-1',
          content: 'Hello',
          role: 'user',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ChatInterface />);

    // Should show message list
    expect(screen.getByTestId('message-list')).toBeInTheDocument();

    // Should show input at bottom
    expect(screen.getByTestId('message-input')).toBeInTheDocument();

    // Should show header and sidebar
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // Should NOT show welcome message
    expect(screen.queryByText("What's on the agenda today?")).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for welcome state layout', () => {
    render(<ChatInterface />);

    // Check that the welcome content has centering classes
    const welcomeContainer = screen.getByText("What's on the agenda today?").closest('div');
    expect(welcomeContainer?.parentElement?.parentElement).toHaveClass('flex-1', 'flex', 'flex-col', 'items-center', 'justify-center');
  });
});
