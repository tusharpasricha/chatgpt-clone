'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, XIcon, FileIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  selectedFiles: File[];
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, onFileRemove, selectedFiles, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFileSelect(files);
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    onFileSelect(files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-2">
      {/* File Upload Button */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="file-upload"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors",
            isDragOver && "bg-blue-50 text-blue-600",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Attach files"
        >
          <PaperclipIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-sm"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-gray-900">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md flex-shrink-0"
                onClick={() => onFileRemove(index)}
                disabled={disabled}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <PaperclipIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-600 font-medium">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
}
