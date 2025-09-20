/**
 * Simple Memory Manager Component
 * Shows memory count, list with scroll, and delete functionality
 */

'use client';

import { Trash2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMemory } from '@/hooks/use-memory';

export function MemoryManager() {
  const {
    memories,
    isLoading,
    error,
    deleteMemory,
  } = useMemory();

  const handleDeleteMemory = async (memoryId: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(memoryId);
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">Memory Manager</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">Memory Manager</h1>
          <span className="text-lg text-gray-600">({memories.length})</span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading memories...</p>
          </CardContent>
        </Card>
      ) : memories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No memories found. Start chatting to build your memory!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Memory list with scroll */
        <div className="max-h-96 overflow-y-auto space-y-3">
          {memories.map((memory) => (
            <Card key={memory.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-700">{memory.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {memory.metadata.timestamp 
                          ? new Date(memory.metadata.timestamp).toLocaleDateString()
                          : 'Unknown date'
                        }
                      </span>
                      {memory.metadata.chatId && (
                        <span>Chat: {memory.metadata.chatId.slice(-8)}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => memory.id && handleDeleteMemory(memory.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
