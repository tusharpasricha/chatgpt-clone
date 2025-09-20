'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types';

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  isUploading: boolean;
}

interface UploadcareFileUploadProps {
  onFileSelect: (attachments: Attachment[]) => void;
  disabled?: boolean;
  uploadingFiles?: UploadingFile[];
  onUploadingFilesChange?: (files: UploadingFile[]) => void;
}

export function UploadcareFileUpload({
  onFileSelect,
  disabled,
  uploadingFiles = [],
  onUploadingFilesChange
}: UploadcareFileUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);

    // Create uploading file objects
    const uploadingFileObjects: UploadingFile[] = files.map(file => ({
      id: `uploading-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      isUploading: true
    }));

    // Add uploading files to the state
    if (onUploadingFilesChange) {
      onUploadingFilesChange([...uploadingFiles, ...uploadingFileObjects]);
    }

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

      // Remove uploading files and add completed attachments
      if (onUploadingFilesChange) {
        const remainingUploadingFiles = uploadingFiles.filter(
          uf => !uploadingFileObjects.some(newUf => newUf.id === uf.id)
        );
        onUploadingFilesChange(remainingUploadingFiles);
      }

      onFileSelect(attachments);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload files. Please try again.');

      // Remove failed uploading files
      if (onUploadingFilesChange) {
        const remainingUploadingFiles = uploadingFiles.filter(
          uf => !uploadingFileObjects.some(newUf => newUf.id === uf.id)
        );
        onUploadingFilesChange(remainingUploadingFiles);
      }
    } finally {
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };



  const isUploading = uploadingFiles.length > 0;

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
            <LoaderIcon className="h-4 w-4 animate-spin text-gray-400" />
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
    </div>
  );
}
