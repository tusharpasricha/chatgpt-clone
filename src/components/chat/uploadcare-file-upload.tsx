'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, XIcon, FileIcon, ImageIcon, LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types';

interface UploadcareFileUploadProps {
  onFileSelect: (attachments: Attachment[]) => void;
  onFileRemove: (index: number) => void;
  selectedFiles: Attachment[];
  disabled?: boolean;
}

export function UploadcareFileUpload({
  onFileSelect,
  onFileRemove,
  selectedFiles,
  disabled
}: UploadcareFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }

      const uploadResult = await uploadResponse.json();

      // Convert upload result to Attachment format
      const attachments: Attachment[] = uploadResult.attachments.map((att: { id: string; name: string; type: string; url: string; size: number; mimeType: string }) => ({
        id: att.id,
        name: att.name,
        type: att.type,
        url: att.url,
        size: att.size,
        mimeType: att.mimeType,
      }));

      onFileSelect(attachments);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type === 'image') {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* File Upload Button */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="file-upload"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "text-blue-600"
          )}
          disabled={disabled || isUploading}
          title={isUploading ? "Uploading..." : "Attach files"}
        >
          {isUploading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PaperclipIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="text-xs text-red-500 max-w-xs">
          {uploadError}
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.id}-${index}`}
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
                disabled={disabled || isUploading}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="text-xs text-blue-600 flex items-center gap-1">
          <LoaderIcon className="h-3 w-3 animate-spin" />
          Uploading files...
        </div>
      )}
    </div>
  );
}
