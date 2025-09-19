import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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

    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Create the AI stream
    const result = await streamText({
      model: openai('gpt-4o-mini'), // Using GPT-4o-mini for cost efficiency
      messages: messages.map((message: { role: 'user' | 'assistant' | 'system'; content: string }) => ({
        role: message.role,
        content: message.content,
      })),
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
