/**
 * Memory API Routes - Mem0 Integration
 * Provides endpoints for memory management operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { mem0Service } from '@/lib/memory/mem0-service';

import { MemoryType } from '@/lib/memory/mem0-config';

// GET /api/memory - Get user memories
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!mem0Service.isAvailable()) {
      return NextResponse.json(
        { error: 'Memory service not available' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') as MemoryType;

    let memories;
    
    if (query) {
      // Search memories
      memories = await mem0Service.searchMemories(query, userId, {
        limit,
        memoryTypes: type ? [type] : undefined,
      });
    } else {
      // Get all memories
      memories = await mem0Service.getUserMemories(userId, limit);
    }

    return NextResponse.json({ memories });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

// POST /api/memory - Add a new memory
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!mem0Service.isAvailable()) {
      return NextResponse.json(
        { error: 'Memory service not available' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { content, type, chatId, tags, confidence } = body;

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    const memoryEntry = {
      content,
      userId,
      metadata: {
        type: type as MemoryType,
        chatId,
        timestamp: new Date(),
        confidence: confidence || 0.8,
        source: 'manual_entry',
        tags: tags || [],
      },
    };

    const memoryId = await mem0Service.addMemory(memoryEntry);

    if (!memoryId) {
      return NextResponse.json(
        { error: 'Failed to add memory' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      id: memoryId,
      message: 'Memory added successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding memory:', error);
    return NextResponse.json(
      { error: 'Failed to add memory' },
      { status: 500 }
    );
  }
}

// DELETE /api/memory - Delete all memories or by type
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!mem0Service.isAvailable()) {
      return NextResponse.json(
        { error: 'Memory service not available' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as MemoryType;

    if (type) {
      // Delete memories of specific type
      const memories = await mem0Service.getUserMemories(userId);
      const memoriesToDelete = memories.filter(m => m.metadata.type === type);
      
      let deletedCount = 0;
      for (const memory of memoriesToDelete) {
        if (memory.id && await mem0Service.deleteMemory(memory.id)) {
          deletedCount++;
        }
      }

      return NextResponse.json({ 
        message: `Deleted ${deletedCount} memories of type ${type}`,
        deletedCount 
      });
    } else {
      // This would delete all memories - require explicit confirmation
      return NextResponse.json(
        { error: 'Deleting all memories requires explicit confirmation' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting memories:', error);
    return NextResponse.json(
      { error: 'Failed to delete memories' },
      { status: 500 }
    );
  }
}
