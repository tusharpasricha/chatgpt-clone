/**
 * Uploadcare integration for file uploads
 * Handles file uploads with Uploadcare's React components
 */

export interface UploadcareConfig {
  publicKey: string;
  multiple: boolean;
  multipleMax?: number;
  multipleMin?: number;
  imgOnly?: boolean;
  accept?: string;
  maxLocalFileSizeBytes?: number;
  localeTranslations?: Record<string, unknown>;
  removeCopyright?: boolean;
  tabs?: string;
  previewStep?: boolean;
  clearable?: boolean;
  cropPreset?: string;
  imageShrink?: string;
  imageResize?: string;
  effects?: string;
}

export const DEFAULT_UPLOADCARE_CONFIG: UploadcareConfig = {
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',
  multiple: true,
  multipleMax: 10,
  multipleMin: 1,
  imgOnly: false,
  accept: 'image/*,.pdf,.doc,.docx,.txt,.csv,.json',
  maxLocalFileSizeBytes: 10 * 1024 * 1024, // 10MB
  removeCopyright: true,
  tabs: 'file camera url facebook gdrive gphotos dropbox instagram',
  previewStep: true,
  clearable: true,
  cropPreset: '',
  imageShrink: '2048x2048',
  imageResize: '2048x2048',
  effects: 'crop,rotate,enhance,grayscale',
  localeTranslations: {
    buttons: {
      choose: {
        files: {
          one: 'Choose file',
          other: 'Choose files'
        },
        images: {
          one: 'Choose image',
          other: 'Choose images'
        }
      }
    },
    dialog: {
      tabs: {
        names: {
          'empty-pubkey': 'Welcome',
          file: 'Local Files',
          url: 'Direct Links',
          camera: 'Camera',
          facebook: 'Facebook',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Instagram',
          dropbox: 'Dropbox'
        }
      }
    }
  }
};

export interface UploadcareFile {
  uuid: string;
  name: string;
  size: number;
  isStored: boolean;
  isImage: boolean;
  mimeType: string;
  originalUrl: string;
  cdnUrl: string;
  originalFilename: string;
}

export interface UploadcareFileInfo {
  uuid: string;
  name: string;
  size: number;
  isStored: boolean;
  isImage: boolean;
  mimeType: string;
  originalUrl: string;
  cdnUrl: string;
  originalFilename: string;
  imageInfo?: {
    width: number;
    height: number;
    format: string;
    colorMode: string;
    orientation: number;
    sequence: boolean;
    geoLocation: unknown;
    datetimeOriginal: string;
    dpi: number[];
  };
}

/**
 * Convert Uploadcare file to our Attachment format
 */
export function uploadcareFileToAttachment(file: UploadcareFile): {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  size: number;
  mimeType: string;
  uploadcareUuid: string;
} {
  return {
    id: file.uuid,
    name: file.originalFilename || file.name,
    type: file.isImage ? 'image' : 'file',
    url: file.cdnUrl,
    size: file.size,
    mimeType: file.mimeType,
    uploadcareUuid: file.uuid,
  };
}

/**
 * Get supported file types for Uploadcare
 */
export const SUPPORTED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  text: ['text/plain', 'text/csv', 'application/json'],
} as const;

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_FILE_TYPES.images,
  ...SUPPORTED_FILE_TYPES.documents,
  ...SUPPORTED_FILE_TYPES.text,
] as const;

/**
 * Check if file type is supported
 */
export function isSupportedFileType(mimeType: string): boolean {
  return (ALL_SUPPORTED_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Get file category from mime type
 */
export function getFileCategory(mimeType: string): 'image' | 'document' | 'text' | 'unknown' {
  if ((SUPPORTED_FILE_TYPES.images as readonly string[]).includes(mimeType)) {
    return 'image';
  }
  if ((SUPPORTED_FILE_TYPES.documents as readonly string[]).includes(mimeType)) {
    return 'document';
  }
  if ((SUPPORTED_FILE_TYPES.text as readonly string[]).includes(mimeType)) {
    return 'text';
  }
  return 'unknown';
}

/**
 * Get optimized image URL from Uploadcare
 */
export function getOptimizedUploadcareUrl(
  uuid: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'smart' | 'smart_retina' | 'normal' | 'better' | 'best' | 'lighter' | 'lightest';
    format?: 'auto' | 'jpeg' | 'png' | 'webp' | 'avif';
    progressive?: 'yes' | 'no';
    resize?: string;
    crop?: string;
    scale_crop?: string;
    smart_resize?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'smart',
    format = 'auto',
    progressive = 'yes',
    resize,
    crop,
    scale_crop,
    smart_resize
  } = options;

  const transformations: string[] = [];

  // Add quality
  transformations.push(`quality/${quality}`);

  // Add format
  transformations.push(`format/${format}`);

  // Add progressive
  transformations.push(`progressive/${progressive}`);

  // Add resize operations
  if (width && height) {
    if (resize) {
      transformations.push(`resize/${width}x${height}`);
    } else if (crop) {
      transformations.push(`crop/${width}x${height}/${crop}`);
    } else if (scale_crop) {
      transformations.push(`scale_crop/${width}x${height}/${scale_crop}`);
    } else if (smart_resize) {
      transformations.push(`smart_resize/${width}x${height}`);
    } else {
      transformations.push(`resize/${width}x${height}`);
    }
  } else if (width) {
    transformations.push(`resize/${width}x`);
  } else if (height) {
    transformations.push(`resize/x${height}`);
  }

  const transformationString = transformations.length > 0 
    ? `/-/${transformations.join('/-/')}/`
    : '/';

  return `https://ucarecdn.com/${uuid}${transformationString}`;
}

/**
 * Validate Uploadcare configuration
 */
export function validateUploadcareConfig(): { valid: boolean; error?: string } {
  if (!process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY) {
    return {
      valid: false,
      error: 'NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY environment variable is required'
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
