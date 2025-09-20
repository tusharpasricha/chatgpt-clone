import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { enhancedContextManager } from '@/lib/memory/enhanced-context-manager';
import { Message } from '@/types';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { messages, chatId } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Process the latest user message for memory extraction (server-side)
    if (enhancedContextManager.isMemoryAvailable() && chatId) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.role === 'user') {
        try {
          await enhancedContextManager.processNewMessage(latestMessage as Message, userId, chatId);
          console.log('Memory extraction completed for message');
        } catch (error) {
          console.error('Memory extraction failed:', error);
          // Don't fail the chat request if memory extraction fails
        }
      }
    }

    // Enhance conversation with relevant memories
    let memoryContext = '';
    if (enhancedContextManager.isMemoryAvailable()) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.role === 'user') {
        try {
          memoryContext = await enhancedContextManager.enhanceConversationContext(userId, latestMessage.content);
          if (memoryContext) {
            console.log('Enhanced conversation with memory context');
          }
        } catch (error) {
          console.error('Memory context enhancement failed:', error);
          // Don't fail the chat request if memory enhancement fails
        }
      }
    }

    // Convert messages to OpenAI SDK format with vision support
    const openaiMessages = messages.map((msg: {
      role: 'user' | 'assistant' | 'system';
      content: string;
      attachments?: Array<{ type: string; name: string; url: string; size: number; mimeType: string }>;
    }) => {
      // Handle messages with image attachments using vision format
      if (msg.attachments && msg.attachments.length > 0) {
        const imageAttachments = msg.attachments.filter(att => att.type === 'image');
        const fileAttachments = msg.attachments.filter(att => att.type !== 'image');

        if (imageAttachments.length > 0) {
          // Use vision format for images - create content array
          const contentArray = [];

          // Add text content if present
          if (msg.content && msg.content.trim()) {
            contentArray.push({
              type: 'text',
              text: msg.content
            });
          }

          // Add images using the correct format for AI SDK
          imageAttachments.forEach(img => {
            contentArray.push({
              type: 'image',
              image: new URL(img.url)
            });
          });

          // Add file descriptions as text if any
          if (fileAttachments.length > 0) {
            const fileDescriptions = fileAttachments.map(file =>
              `[File: ${file.name}]`
            ).join(' ');
            contentArray.push({
              type: 'text',
              text: fileDescriptions
            });
          }

          return {
            role: msg.role,
            content: contentArray
          };
        } else {
          // Only non-image files, handle as text descriptions
          const fileDescriptions = fileAttachments.map(file =>
            `[File: ${file.name}]`
          ).join(' ');
          const content = msg.content ? `${msg.content} ${fileDescriptions}` : fileDescriptions;

          return {
            role: msg.role,
            content: content
          };
        }
      }

      // No attachments, simple text message
      return {
        role: msg.role,
        content: msg.content || ''
      };
    });

    // Add system message with memory context if available
    const systemMessage = memoryContext
      ? `You are a helpful AI assistant. ${memoryContext}`
      : 'You are a helpful AI assistant.';

    const messagesWithSystem = [
      { role: 'system' as const, content: systemMessage },
      ...openaiMessages
    ];

    // Create the AI stream
    const result = streamText({
      model: openai('gpt-4o'), // Using GPT-4o for vision support
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messagesWithSystem as any, // Type assertion needed for vision messages
      temperature: 0.7,
    });

    // Create a custom streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            const data = `0:${JSON.stringify({ type: 'text-delta', textDelta: chunk })}\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new Response('OpenAI API key not configured', { status: 500 });
      }
      if (error.message.includes('quota')) {
        return new Response('API quota exceeded', { status: 429 });
      }
    }

    return new Response('Internal server error', { status: 500 });
  }
}
