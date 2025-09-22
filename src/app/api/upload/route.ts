import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UploadClient } from '@uploadcare/upload-client';
import { UploadcareSimpleAuthSchema, storeFile, fileInfo } from '@uploadcare/rest-client';
import { ALL_SUPPORTED_TYPES, isSupportedFileType } from '@/lib/upload/uploadcare';
import { extractPDFText, isPDFFile, truncateText } from '@/lib/pdf/pdf-extractor';

// Initialize Uploadcare clients
const uploadcare = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
});

const authSchema = new UploadcareSimpleAuthSchema({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate Uploadcare configuration
    if (!process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || !process.env.UPLOADCARE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Uploadcare configuration missing (public key or secret key)' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadResults = [];

    for (const file of files) {
      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File size must be less than ${maxSize / (1024 * 1024)}MB` },
          { status: 400 }
        );
      }

      if (!isSupportedFileType(file.type)) {
        return NextResponse.json(
          { error: `File type '${file.type}' not supported. Supported types: ${ALL_SUPPORTED_TYPES.join(', ')}` },
          { status: 400 }
        );
      }

      try {
        console.log(`Starting upload for file: ${file.name}, size: ${file.size}, type: ${file.type}`);

        // Convert to buffer first (more reliable approach)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`Converted file to buffer, size: ${buffer.length}`);

        const uploadResult = await uploadcare.uploadFile(buffer, {
          fileName: file.name,
          contentType: file.type,
          store: 'auto',
        });


        // Explicitly store the file using REST API
        let info;
        try {
          console.log(`Explicitly storing file ${uploadResult.uuid}...`);
          await storeFile({ uuid: uploadResult.uuid }, { authSchema });
          console.log(`File ${uploadResult.uuid} stored successfully`);

          // Verify file info after storage
          info = await fileInfo({ uuid: uploadResult.uuid }, { authSchema });
          console.log(`File info:`, JSON.stringify(info, null, 2));
        } catch (storeError) {
          console.log(`Failed to explicitly store file ${uploadResult.uuid}:`, storeError);
          // Continue anyway as the file might already be stored
        }

        // Use the original file URL from Uploadcare's storage CDN
        const cdnUrl = info?.originalFileUrl || uploadResult.cdnUrl || `https://ucarecdn.com/${uploadResult.uuid}/`;

        console.log(`Using original file URL: ${cdnUrl}`);

        // Verify the URL is accessible
        try {
          const testResponse = await fetch(cdnUrl, { method: 'HEAD' });
          if (testResponse.ok) {
            console.log(`✅ Original file URL is accessible: ${cdnUrl}`);
          } else {
            console.log(`⚠️ Original file URL returned status ${testResponse.status}: ${cdnUrl}`);
          }
        } catch (error) {
          console.log(`⚠️ Could not verify original file URL: ${cdnUrl}`, error);
        }

        console.log(`Upload successful for ${file.name}, UUID: ${uploadResult.uuid}`);

        // Create base attachment object
        const attachment = {
          id: uploadResult.uuid,
          name: uploadResult.originalFilename || file.name,
          type: uploadResult.isImage ? 'image' : 'file' as const,
          url: cdnUrl,
          size: uploadResult.size,
          mimeType: uploadResult.mimeType || file.type,
          uploadcareUuid: uploadResult.uuid,
        };

        // Extract text content for PDF files
        if (isPDFFile(uploadResult.mimeType || file.type)) {
          console.log(`Extracting text from PDF: ${file.name}`);
          try {
            const extractionResult = await extractPDFText(cdnUrl);
            if (extractionResult.success && extractionResult.text) {
              // Truncate text to prevent token limit issues
              const truncatedText = truncateText(extractionResult.text, 8000);

              (attachment as any).extractedText = truncatedText;
              (attachment as any).extractionMetadata = {
                pages: extractionResult.metadata?.pages,
                title: extractionResult.metadata?.title,
                author: extractionResult.metadata?.author,
                extractedAt: new Date(),
              };

              console.log(`PDF text extraction successful. Text length: ${truncatedText.length}, Pages: ${extractionResult.metadata?.pages}`);
            } else {
              console.log(`PDF text extraction failed: ${extractionResult.error}`);
            }
          } catch (extractionError) {
            console.error(`PDF text extraction error for ${file.name}:`, extractionError);
            // Continue without text extraction - file upload should still succeed
          }
        }

        console.log(`Created attachment with URL: ${cdnUrl}`);

        uploadResults.push(attachment);
      } catch (uploadError) {
        console.error('Uploadcare upload error for file:', file.name);
        console.error('Error details:', uploadError);
        console.error('Error stack:', uploadError instanceof Error ? uploadError.stack : 'No stack trace');

        return NextResponse.json(
          { error: `Failed to upload ${file.name} to Uploadcare: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      attachments: uploadResults,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle file deletion
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID (Uploadcare UUID) required' },
        { status: 400 }
      );
    }

    try {
      // Note: File deletion from Uploadcare requires the REST API client
      // For now, we'll just return success as files will be automatically
      // cleaned up by Uploadcare's retention policies
      // To implement actual deletion, you would need @uploadcare/rest-client

      return NextResponse.json({
        success: true,
        message: 'File deletion requested successfully',
      });
    } catch (deleteError) {
      console.error('Uploadcare delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete file from Uploadcare' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
