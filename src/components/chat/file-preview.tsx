'use client';

import { Button } from '@/components/ui/button';
import { XIcon, FileIcon, ImageIcon, LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types';

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  isUploading: boolean;
}

interface FilePreviewProps {
  attachments: Attachment[];
  uploadingFiles: UploadingFile[];
  onRemoveAttachment: (index: number) => void;
  onRemoveUploadingFile: (id: string) => void;
  disabled?: boolean;
}

export function FilePreview({
  attachments,
  uploadingFiles,
  onRemoveAttachment,
  onRemoveUploadingFile,
  disabled
}: FilePreviewProps) {
  const getFileIcon = (type: string, mimeType?: string) => {
    if (type === 'image' || mimeType?.startsWith('image/')) {
      return <ImageIcon className="h-3 w-3 text-blue-500" />;
    }
    return <FileIcon className="h-3 w-3 text-gray-500" />;
  };

  const getFileTypeFromMimeType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    return 'file';
  };

  if (attachments.length === 0 && uploadingFiles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {/* Uploading files */}
      {uploadingFiles.map((file) => {
        const isImage = file.type.startsWith('image/');

        return (
          <div key={file.id} className="relative">
            {isImage ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <LoaderIcon className="h-6 w-6 animate-spin text-gray-500" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-0 -right-0 h-5 w-5 rounded-full bg-gray-800  text-white p-0 shadow-sm"
                  onClick={() => onRemoveUploadingFile(file.id)}
                  disabled={disabled}
                >
                  <XIcon className="h-1 w-1" />
                </Button>
              </div>
            ) : (
              <div className="relative flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 max-w-[200px]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <LoaderIcon className="h-3 w-3 animate-spin text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-700 truncate">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Uploading...
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-0 -right-0 h-5 w-5 rounded-full bg-gray-800  text-white p-0 shadow-sm cursor-pointer"
                  onClick={() => onRemoveUploadingFile(file.id)}
                  disabled={disabled}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* Uploaded files */}
      {attachments.map((attachment, index) => (
        <div
          key={`${attachment.id}-${index}`}
          className="relative"
        >
          {attachment.type === 'image' ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to file icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-0 -right-0 h-5 w-5 rounded-full bg-gray-800 text-white p-0 shadow-sm"
                onClick={() => onRemoveAttachment(index)}
                disabled={disabled}
              >
                <XIcon className="h-1 w-1" />
              </Button>
            </div>
          ) : (
            <div className="relative flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 max-w-[200px]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(attachment.type, attachment.mimeType)}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-700 truncate">
                    {attachment.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {formatFileSize(attachment.size)}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-0 -right-0 h-5 w-5 rounded-full bg-gray-800  text-white p-0 shadow-sm"
                onClick={() => onRemoveAttachment(index)}
                disabled={disabled}
              >
                <XIcon className="h-1 w-1" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
