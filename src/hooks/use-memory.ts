/**
 * Memory Management Hook
 * Provides React hooks for interacting with Mem0 memory system
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { MemoryEntry } from '@/lib/memory/mem0-service';
import { MemoryType } from '@/lib/memory/mem0-config';

interface MemoryStats {
  totalMemories: number;
  memoriesByType: Record<MemoryType, number>;
  oldestMemory?: Date;
  newestMemory?: Date;
}

interface UseMemoryReturn {
  memories: MemoryEntry[];
  stats: MemoryStats | null;
  isLoading: boolean;
  error: string | null;
  searchMemories: (query: string, options?: SearchOptions) => Promise<void>;
  addMemory: (content: string, type: MemoryType, options?: AddMemoryOptions) => Promise<boolean>;
  deleteMemory: (memoryId: string) => Promise<boolean>;
  updateMemory: (memoryId: string, content: string) => Promise<boolean>;
  refreshMemories: () => Promise<void>;
  refreshStats: () => Promise<void>;
  cleanupMemories: () => Promise<number>;
}

interface SearchOptions {
  limit?: number;
  type?: MemoryType;
  minRelevance?: number;
}

interface AddMemoryOptions {
  chatId?: string;
  tags?: string[];
  confidence?: number;
}

export function useMemory(): UseMemoryReturn {
  const { user } = useUser();
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search memories
  const searchMemories = useCallback(async (query: string, options: SearchOptions = {}) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query,
        limit: (options.limit || 50).toString(),
        ...(options.type && { type: options.type }),
      });

      const response = await fetch(`/api/memory?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to search memories');
      }

      const data = await response.json();
      setMemories(data.memories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search memories');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Add a new memory
  const addMemory = useCallback(async (
    content: string, 
    type: MemoryType, 
    options: AddMemoryOptions = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;

    setError(null);

    try {
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          type,
          chatId: options.chatId,
          tags: options.tags,
          confidence: options.confidence,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add memory');
      }

      // Refresh memories after adding
      await refreshMemories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memory');
      return false;
    }
  }, [user?.id]);

  // Delete a memory
  const deleteMemory = useCallback(async (memoryId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setError(null);

    try {
      const response = await fetch(`/api/memory/${memoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }

      // Remove from local state
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete memory');
      return false;
    }
  }, [user?.id]);

  // Update a memory
  const updateMemory = useCallback(async (memoryId: string, content: string): Promise<boolean> => {
    if (!user?.id) return false;

    setError(null);

    try {
      const response = await fetch(`/api/memory/${memoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update memory');
      }

      // Update local state
      setMemories(prev => prev.map(m => 
        m.id === memoryId ? { ...m, content } : m
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update memory');
      return false;
    }
  }, [user?.id]);

  // Refresh memories
  const refreshMemories = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/memory');
      
      if (!response.ok) {
        throw new Error('Failed to fetch memories');
      }

      const data = await response.json();
      setMemories(data.memories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memories');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/memory/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch memory stats');
      }

      const data = await response.json();
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memory stats');
    }
  }, [user?.id]);

  // Cleanup expired memories
  const cleanupMemories = useCallback(async (): Promise<number> => {
    if (!user?.id) return 0;

    try {
      const response = await fetch('/api/memory/cleanup', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cleanup memories');
      }

      const data = await response.json();
      
      // Refresh memories and stats after cleanup
      await Promise.all([refreshMemories(), refreshStats()]);
      
      return data.deletedCount || 0;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cleanup memories');
      return 0;
    }
  }, [user?.id, refreshMemories, refreshStats]);

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      Promise.all([refreshMemories(), refreshStats()]);
    }
  }, [user?.id, refreshMemories, refreshStats]);

  return {
    memories,
    stats,
    isLoading,
    error,
    searchMemories,
    addMemory,
    deleteMemory,
    updateMemory,
    refreshMemories,
    refreshStats,
    cleanupMemories,
  };
}

// Hook for memory statistics only
export function useMemoryStats() {
  const { user } = useUser();
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/memory/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch memory stats');
      }

      const data = await response.json();
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memory stats');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshStats();
    }
  }, [user?.id, refreshStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
}
