/**
 * Individual Memory API Routes
 * Handles operations on specific memory entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { mem0Service } from '@/lib/memory/mem0-service';

// GET /api/memory/[memoryId] - Get specific memory
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { memoryId } = await params;

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

    // Get all user memories and find the specific one
    // (Mem0 doesn't have a direct get-by-id method in the current API)
    const memories = await mem0Service.getUserMemories(userId);
    const memory = memories.find(m => m.id === memoryId);

    if (!memory) {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory' },
      { status: 500 }
    );
  }
}

// PUT /api/memory/[memoryId] - Update specific memory
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { memoryId } = await params;

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
    const { content, metadata } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Verify the memory belongs to the user
    const memories = await mem0Service.getUserMemories(userId);
    const existingMemory = memories.find(m => m.id === memoryId);

    if (!existingMemory) {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    const success = await mem0Service.updateMemory(memoryId, content, metadata);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update memory' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Memory updated successfully' 
    });
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json(
      { error: 'Failed to update memory' },
      { status: 500 }
    );
  }
}

// DELETE /api/memory/[memoryId] - Delete specific memory
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { memoryId } = await params;

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

    // Verify the memory belongs to the user
    const memories = await mem0Service.getUserMemories(userId);
    const existingMemory = memories.find(m => m.id === memoryId);

    if (!existingMemory) {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    const success = await mem0Service.deleteMemory(memoryId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete memory' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Memory deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    );
  }
}
