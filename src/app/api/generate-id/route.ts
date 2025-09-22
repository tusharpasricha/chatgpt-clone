import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uuidService } from '@/lib/db/uuid-service';

// POST /api/generate-id - Generate UUIDs
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, count = 1 } = body;

    if (!type || !['chat', 'message'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "chat" or "message"' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      );
    }

    const ids: string[] = [];

    for (let i = 0; i < count; i++) {
      if (type === 'chat') {
        ids.push(uuidService.generateChatId());
      } else {
        ids.push(uuidService.generateMessageId());
      }
    }

    return NextResponse.json({ 
      ids: count === 1 ? ids[0] : ids 
    });
  } catch (error) {
    console.error('Error generating ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate ID' },
      { status: 500 }
    );
  }
}
