import { renderHook, act } from '@testing-library/react'
import { ChatProvider, useChat } from '@/contexts/chat-context'
import { ReactNode } from 'react'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChatProvider>{children}</ChatProvider>
)

describe('ChatContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ chats: [] }),
    })
  })

  it('provides initial state', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    
    expect(result.current.chats).toEqual([])
    expect(result.current.activeChat).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('creates new chat', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'new-chat-id',
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    })

    const { result } = renderHook(() => useChat(), { wrapper })
    
    await act(async () => {
      const newChat = await result.current.createNewChat()
      expect(newChat.id).toBe('new-chat-id')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Chat' }),
    })
  })

  it('sends message', async () => {
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('0:{"type":"text-delta","textDelta":"Hello"}'),
            })
            .mockResolvedValueOnce({
              done: true,
              value: undefined,
            }),
        }),
      },
    }
    
    mockFetch.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useChat(), { wrapper })
    
    // First create a chat
    act(() => {
      result.current.selectChat({
        id: 'test-chat',
        title: 'Test Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    await act(async () => {
      await result.current.sendMessage('Hello')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })
  })

  it('handles errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useChat(), { wrapper })
    
    act(() => {
      result.current.selectChat({
        id: 'test-chat',
        title: 'Test Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    await act(async () => {
      await result.current.sendMessage('Hello')
    })

    expect(result.current.error).toBeTruthy()
  })

  it('updates message content', async () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    
    // Set up a chat with a message
    act(() => {
      result.current.selectChat({
        id: 'test-chat',
        title: 'Test Chat',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Original message',
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    mockFetch.mockResolvedValueOnce({ ok: true })

    await act(async () => {
      await result.current.updateMessage('msg-1', 'Updated message')
    })

    expect(result.current.activeChat?.messages[0].content).toBe('Updated message')
  })
})
