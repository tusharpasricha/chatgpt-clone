/**
 * Tests for advanced chat features
 * - Message editing system
 * - File upload functionality
 * - Context management
 * - Long-context handling
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessageBubble } from '@/components/chat/message-bubble';
import { FileUpload } from '@/components/chat/file-upload';
import {
  estimateTokens,
  estimateMessageTokens,
  manageContextWindow,
  prepareMessagesForAPI
} from '@/lib/chat/context-manager';
import { validateFile } from '@/lib/upload/cloudinary';
import { Message, Attachment } from '@/types';

// Mock the chat context
const mockUpdateMessage = jest.fn();
const mockRegenerateResponse = jest.fn();

jest.mock('@/contexts/chat-context', () => ({
  useChat: () => ({
    updateMessage: mockUpdateMessage,
    regenerateResponse: mockRegenerateResponse,
  }),
}));

describe('Advanced Chat Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Message Editing System', () => {
    const mockMessage: Message = {
      id: 'test-msg-1',
      content: 'This is a test message',
      role: 'user',
      timestamp: new Date(),
    };

    it('should render message with edit button for user messages', () => {
      render(<MessageBubble message={mockMessage} />);
      
      // Should show edit button on hover
      const messageElement = screen.getByText('This is a test message');
      fireEvent.mouseEnter(messageElement.closest('.group')!);
      
      expect(screen.getByTitle('Edit message')).toBeInTheDocument();
    });

    it('should enter edit mode when edit button is clicked', async () => {
      render(<MessageBubble message={mockMessage} />);
      
      const messageElement = screen.getByText('This is a test message');
      fireEvent.mouseEnter(messageElement.closest('.group')!);
      
      const editButton = screen.getByTitle('Edit message');
      fireEvent.click(editButton);
      
      // Should show textarea with current content
      expect(screen.getByDisplayValue('This is a test message')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should call updateMessage when save is clicked', async () => {
      render(<MessageBubble message={mockMessage} />);
      
      const messageElement = screen.getByText('This is a test message');
      fireEvent.mouseEnter(messageElement.closest('.group')!);
      
      const editButton = screen.getByTitle('Edit message');
      fireEvent.click(editButton);
      
      const textarea = screen.getByDisplayValue('This is a test message');
      fireEvent.change(textarea, { target: { value: 'Updated message content' } });
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUpdateMessage).toHaveBeenCalledWith('test-msg-1', 'Updated message content');
      });
    });
  });

  describe('File Upload Functionality', () => {
    const mockOnFileSelect = jest.fn();
    const mockOnFileRemove = jest.fn();

    it('should render file upload component', () => {
      render(
        <FileUpload
          onFileSelect={mockOnFileSelect}
          onFileRemove={mockOnFileRemove}
          selectedFiles={[]}
        />
      );
      
      expect(screen.getByTitle('Attach files')).toBeInTheDocument();
    });

    it('should display selected files', () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      render(
        <FileUpload
          onFileSelect={mockOnFileSelect}
          onFileRemove={mockOnFileRemove}
          selectedFiles={[mockFile]}
        />
      );
      
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('should validate file types and sizes', () => {
      // Valid file
      const validFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      expect(validateFile(validFile).valid).toBe(true);
      
      // Invalid file type
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-executable' });
      expect(validateFile(invalidFile).valid).toBe(false);
      
      // File too large (create a mock large file)
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
      expect(validateFile(largeFile).valid).toBe(false);
    });
  });

  describe('Context Management', () => {
    const createMockMessage = (content: string, role: 'user' | 'assistant' = 'user'): Message => ({
      id: `msg-${Math.random()}`,
      content,
      role,
      timestamp: new Date(),
    });

    it('should estimate tokens correctly', () => {
      expect(estimateTokens('Hello world')).toBeGreaterThan(0);
      expect(estimateTokens('A longer message with more content')).toBeGreaterThan(estimateTokens('Short'));
    });

    it('should calculate message tokens including attachments', () => {
      const messageWithoutAttachments = createMockMessage('Hello world');
      const tokensWithout = estimateMessageTokens(messageWithoutAttachments);
      
      const messageWithAttachments: Message = {
        ...messageWithoutAttachments,
        attachments: [{
          id: 'att-1',
          name: 'image.jpg',
          type: 'image',
          url: 'https://example.com/image.jpg',
          size: 1024,
          mimeType: 'image/jpeg',
        }],
      };
      
      const tokensWithAttachments = estimateMessageTokens(messageWithAttachments);
      expect(tokensWithAttachments).toBeGreaterThan(tokensWithout);
    });

    it('should manage context window for long conversations', async () => {
      const messages = Array.from({ length: 50 }, (_, i) => 
        createMockMessage(`Message ${i} with some content to make it longer`, i % 2 === 0 ? 'user' : 'assistant')
      );
      
      const contextWindow = await manageContextWindow(messages, {
        maxTokens: 1000,
        reserveTokensForResponse: 200,
      });
      
      expect(contextWindow.messages.length).toBeLessThan(messages.length);
      expect(contextWindow.totalTokens).toBeLessThanOrEqual(850); // Allow some buffer for token estimation
      expect(contextWindow.summary).toBeDefined();
    });

    it('should prepare messages for API with context management', async () => {
      const messages = [
        createMockMessage('Hello', 'user'),
        createMockMessage('Hi there!', 'assistant'),
        createMockMessage('How are you?', 'user'),
      ];
      
      const apiMessages = await prepareMessagesForAPI(messages);
      
      expect(apiMessages).toHaveLength(3);
      expect(apiMessages[0]).toHaveProperty('role', 'user');
      expect(apiMessages[0]).toHaveProperty('content', 'Hello');
    });
  });

  describe('Attachment Display', () => {
    const mockAttachment: Attachment = {
      id: 'att-1',
      name: 'test-image.jpg',
      type: 'image',
      url: 'https://example.com/test-image.jpg',
      size: 1024,
      mimeType: 'image/jpeg',
    };

    const messageWithAttachment: Message = {
      id: 'msg-1',
      content: 'Check out this image',
      role: 'user',
      timestamp: new Date(),
      attachments: [mockAttachment],
    };

    it('should display image attachments', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      
      expect(screen.getByAltText('test-image.jpg')).toBeInTheDocument();
      expect(screen.getByText('test-image.jpg • 1 KB')).toBeInTheDocument();
    });

    it('should display file attachments', () => {
      const fileAttachment: Attachment = {
        ...mockAttachment,
        name: 'document.pdf',
        type: 'file',
        mimeType: 'application/pdf',
      };

      const messageWithFile: Message = {
        ...messageWithAttachment,
        attachments: [fileAttachment],
      };

      render(<MessageBubble message={messageWithFile} />);
      
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByTitle('Download file')).toBeInTheDocument();
    });
  });
});
