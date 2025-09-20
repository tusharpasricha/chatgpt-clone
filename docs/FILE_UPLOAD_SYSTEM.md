# File Upload System - Uploadcare Only

## Overview

The ChatGPT clone now uses **Uploadcare exclusively** for file uploads, replacing the previous hybrid approach. This provides a more robust, scalable, and production-ready file handling system.

## Architecture

### Components

1. **Frontend Upload Component**: `src/components/chat/uploadcare-file-upload.tsx`
2. **Upload API Route**: `src/app/api/upload/route.ts`
3. **Uploadcare Utilities**: `src/lib/upload/uploadcare.ts`
4. **Type Definitions**: `src/types/index.ts`

### Dependencies

- `@uploadcare/upload-client` - For uploading files to Uploadcare
- `@uploadcare/react-uploader` - React components (available but not currently used)

## Step-by-Step Upload Flow

### 1. File Selection
- User clicks paperclip icon in message input
- File picker opens with supported file types
- Multiple files can be selected (up to 10MB each)
- Drag & drop is supported

### 2. Client-Side Processing
```typescript
// Files are collected and sent to API
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

### 3. Server-Side Upload to Uploadcare
```typescript
// Upload directly to Uploadcare
const uploadResult = await uploadcare.uploadFile(file, {
  fileName: file.name,
  contentType: file.type,
  store: 'auto',
});
```

### 4. Attachment Creation
```typescript
const attachment = {
  id: uploadResult.uuid,
  name: uploadResult.originalFilename || file.name,
  type: uploadResult.isImage ? 'image' : 'file',
  url: uploadResult.cdnUrl,
  size: uploadResult.size,
  mimeType: uploadResult.mimeType || file.type,
  uploadcareUuid: uploadResult.uuid,
};
```

### 5. Message Integration
- Attachments are included in message objects
- Images are processed with GPT-4o vision capabilities
- Files are displayed with download options

## Supported File Types

### Images (with AI Vision)
- JPEG (`image/jpeg`)
- PNG (`image/png`)
- GIF (`image/gif`)
- WebP (`image/webp`)

### Documents
- PDF (`application/pdf`)
- Word Documents (`.doc`, `.docx`)

### Text Files
- Plain Text (`text/plain`)
- CSV (`text/csv`)
- JSON (`application/json`)

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_public_key
UPLOADCARE_SECRET_KEY=your_secret_key  # For future REST API operations
```

### File Limits
- **Max file size**: 10MB per file
- **Max files**: Multiple files supported
- **Storage**: Auto-stored on Uploadcare CDN

## Benefits of Uploadcare-Only Approach

### 1. **Production Ready**
- No more base64 data URLs
- Proper CDN delivery
- Automatic image optimization

### 2. **Scalable**
- Files stored on Uploadcare's global CDN
- No server storage requirements
- Automatic backup and redundancy

### 3. **Performance**
- Fast CDN delivery
- Image transformations on-the-fly
- Optimized for web delivery

### 4. **Security**
- Secure file uploads
- Virus scanning (available)
- Access control options

## File Display and Management

### Image Display
- Clickable thumbnails
- Automatic optimization
- Download functionality
- Hover effects with controls

### File Display
- File type icons
- File size information
- Download buttons
- Proper file naming

## AI Integration

### Vision Support
Images are processed using GPT-4o's vision capabilities:
```typescript
// Images are sent to AI as vision content
imageAttachments.forEach(img => {
  contentArray.push({
    type: 'image',
    image: new URL(img.url)
  });
});
```

### File Context
Non-image files are included as text descriptions in the AI context.

## Future Enhancements

### Planned Features
1. **File Deletion**: Implement REST API for file cleanup
2. **Advanced Transformations**: Image cropping, resizing
3. **File Management**: Better organization and search
4. **Batch Operations**: Multiple file operations

### Available Uploadcare Features
- Image transformations
- Video processing
- Document preview
- Advanced security options
- Analytics and monitoring

## Migration Notes

### Changes Made
1. ✅ Removed hybrid approach
2. ✅ Updated upload route to use Uploadcare directly
3. ✅ Added uploadcareUuid to Attachment type
4. ✅ Removed old file-upload.tsx component
5. ✅ Added utility functions for file type validation

### Backward Compatibility
- Existing attachments without `uploadcareUuid` still work
- Message format remains the same
- UI components unchanged

## Troubleshooting

### Common Issues
1. **Missing Public Key**: Check environment variables
2. **File Type Errors**: Verify supported file types
3. **Size Limits**: Ensure files are under 10MB
4. **Network Issues**: Check Uploadcare service status

### Debug Information
Upload errors are logged with detailed information for troubleshooting.
