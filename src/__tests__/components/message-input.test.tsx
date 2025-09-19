import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageInput } from '@/components/chat/message-input'

// Mock the chat context
const mockSendMessage = jest.fn()
const mockChatContext = {
  chats: [],
  activeChat: null,
  isLoading: false,
  error: null,
  createNewChat: jest.fn(),
  selectChat: jest.fn(),
  deleteChat: jest.fn(),
  sendMessage: mockSendMessage,
  regenerateResponse: jest.fn(),
  updateChatTitle: jest.fn(),
  updateMessage: jest.fn(),
}

jest.mock('@/contexts/chat-context', () => ({
  useChat: () => mockChatContext,
  ChatProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('MessageInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders message input correctly', () => {
    render(<MessageInput />)
    
    expect(screen.getByPlaceholderText('Ask anything')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('allows typing in the textarea', async () => {
    const user = userEvent.setup()
    render(<MessageInput />)
    
    const textarea = screen.getByPlaceholderText('Ask anything')
    await user.type(textarea, 'Hello, world!')
    
    expect(textarea).toHaveValue('Hello, world!')
  })

  it('sends message when form is submitted', async () => {
    const user = userEvent.setup()
    render(<MessageInput />)
    
    const textarea = screen.getByPlaceholderText('Ask anything')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(textarea, 'Test message')
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Test message')
    })
    
    expect(textarea).toHaveValue('')
  })

  it('sends message when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<MessageInput />)
    
    const textarea = screen.getByPlaceholderText('Ask anything')
    
    await user.type(textarea, 'Test message')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Test message')
    })
  })

  it('does not send empty messages', async () => {
    const user = userEvent.setup()
    render(<MessageInput />)
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)
    
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('disables input when loading', async () => {
    const loadingContext = { ...mockChatContext, isLoading: true }
    const { useChat } = await import('@/contexts/chat-context')
    jest.mocked(useChat).mockReturnValue(loadingContext)

    render(<MessageInput />)
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()
  })

  it('handles file upload', async () => {
    const user = userEvent.setup()
    render(<MessageInput />)
    
    const fileInput = screen.getByLabelText(/attach files/i)
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    
    await user.upload(fileInput, file)
    
    expect(screen.getByText('test.txt')).toBeInTheDocument()
  })
})
