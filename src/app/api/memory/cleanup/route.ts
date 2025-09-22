/**
 * Memory Cleanup API Route
 * Handles cleanup of expired memories
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { enhancedContextManager } from '@/lib/memory/enhanced-context-manager';

// POST /api/memory/cleanup - Clean up expired memories
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!enhancedContextManager.isMemoryAvailable()) {
      return NextResponse.json(
        { error: 'Memory service not available' },
        { status: 503 }
      );
    }

    const deletedCount = await enhancedContextManager.cleanupUserMemories(userId);

    return NextResponse.json({ 
      message: `Cleaned up ${deletedCount} expired memories`,
      deletedCount 
    });
  } catch (error) {
    console.error('Error cleaning up memories:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup memories' },
      { status: 500 }
    );
  }
}
