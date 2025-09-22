/**
 * Memory Statistics API Route
 * Provides memory analytics and statistics
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { enhancedContextManager } from '@/lib/memory/enhanced-context-manager';

// GET /api/memory/stats - Get memory statistics
export async function GET() {
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

    const stats = await enhancedContextManager.getMemoryStats(userId);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching memory stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory statistics' },
      { status: 500 }
    );
  }
}

// POST /api/memory/stats/cleanup - Clean up expired memories
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
