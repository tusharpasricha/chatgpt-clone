'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, XIcon, FileIcon, ImageIcon, LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DEFAULT_UPLOADCARE_CONFIG, 
  uploadcareFileToAttachment,
  formatFileSize,
  validateUploadcareConfig,
  type UploadcareFile 
} from '@/lib/upload/uploadcare';
import { Attachment } from '@/types';

// Import Uploadcare React components
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

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
  const [isConfigValid, setIsConfigValid] = useState(false);

  // Validate Uploadcare configuration on mount
  useEffect(() => {
    const validation = validateUploadcareConfig();
    setIsConfigValid(validation.valid);
    if (!validation.valid) {
      console.error('Uploadcare configuration error:', validation.error);
      setUploadError(validation.error || 'Uploadcare not configured');
    }
  }, []);

  const handleUploadSuccess = (event: {
    uuid?: string;
    name?: string;
    size?: number;
    isImage?: boolean;
    mimeType?: string;
    originalUrl?: string;
    cdnUrl?: string;
    allEntries?: Array<{ uuid: string; name: string; size: number; mimeType: string; cdnUrl: string }>
  }) => {
    setIsUploading(false);
    setUploadError(null);
    
    // Handle single file upload success
    if (event.uuid) {
      const uploadcareFile: UploadcareFile = {
        uuid: event.uuid,
        name: event.name || 'Unknown file',
        size: event.size || 0,
        isStored: true,
        isImage: event.isImage || false,
        mimeType: event.mimeType || 'application/octet-stream',
        originalUrl: event.originalUrl || event.cdnUrl || '',
        cdnUrl: event.cdnUrl || '',
        originalFilename: event.name || 'Unknown file',
      };
      
      const attachment = uploadcareFileToAttachment(uploadcareFile);
      onFileSelect([attachment]);
    }
  };

  const handleUploadError = (event: { error?: { message?: string }; message?: string }) => {
    setIsUploading(false);
    const errorMessage = event.error?.message || event.message || 'Upload failed';
    setUploadError(errorMessage);
    console.error('Uploadcare upload error:', event);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadError(null);
  };

  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type === 'image') {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  // If Uploadcare is not configured, show fallback message
  if (!isConfigValid) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 cursor-not-allowed opacity-50"
          disabled
          title="File upload not configured"
        >
          <PaperclipIcon className="h-4 w-4" />
        </Button>
        {uploadError && (
          <div className="text-xs text-red-500 max-w-xs">
            {uploadError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Uploadcare File Uploader */}
      <div className="relative">
        <FileUploaderRegular
          pubkey={DEFAULT_UPLOADCARE_CONFIG.publicKey}
          multiple={DEFAULT_UPLOADCARE_CONFIG.multiple}
          multipleMax={DEFAULT_UPLOADCARE_CONFIG.multipleMax}
          multipleMin={DEFAULT_UPLOADCARE_CONFIG.multipleMin}
          imgOnly={DEFAULT_UPLOADCARE_CONFIG.imgOnly}
          accept={DEFAULT_UPLOADCARE_CONFIG.accept}
          maxLocalFileSizeBytes={DEFAULT_UPLOADCARE_CONFIG.maxLocalFileSizeBytes}
          removeCopyright={DEFAULT_UPLOADCARE_CONFIG.removeCopyright}
          tabs={DEFAULT_UPLOADCARE_CONFIG.tabs}
          previewStep={DEFAULT_UPLOADCARE_CONFIG.previewStep}
          clearable={DEFAULT_UPLOADCARE_CONFIG.clearable}
          cropPreset={DEFAULT_UPLOADCARE_CONFIG.cropPreset}
          imageShrink={DEFAULT_UPLOADCARE_CONFIG.imageShrink}
          imageResize={DEFAULT_UPLOADCARE_CONFIG.imageResize}
          effects={DEFAULT_UPLOADCARE_CONFIG.effects}
          localeTranslations={DEFAULT_UPLOADCARE_CONFIG.localeTranslations}
          onFileUploadSuccess={handleUploadSuccess}
          onFileUploadFailed={handleUploadError}
          onFileUploadStart={handleUploadStart}
          className="uc-light"
        >
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
        </FileUploaderRegular>
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
