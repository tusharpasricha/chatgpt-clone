import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadToCloudinary, validateFile, generateUniqueFilename } from '@/lib/upload/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      try {
        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(file.name);
        
        // Determine upload options based on file type
        const isImage = file.type.startsWith('image/');
        const uploadOptions = {
          folder: `chatgpt-clone/${userId}`,
          resourceType: isImage ? 'image' : 'raw' as const,
          allowedFormats: isImage 
            ? ['jpg', 'jpeg', 'png', 'gif', 'webp']
            : ['pdf', 'txt', 'csv', 'json', 'doc', 'docx'],
          maxFileSize: 10 * 1024 * 1024, // 10MB
          transformation: isImage ? {
            quality: 'auto',
            fetch_format: 'auto',
          } : undefined,
        };

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          buffer,
          uniqueFilename,
          uploadOptions
        );

        // Create attachment object
        const attachment = {
          id: uuidv4(),
          name: file.name,
          type: isImage ? 'image' : 'file' as const,
          url: uploadResult.secureUrl,
          size: file.size,
          mimeType: file.type,
          cloudinaryId: uploadResult.publicId,
        };

        uploadResults.push(attachment);
      } catch (uploadError) {
        console.error('Upload error for file:', file.name, uploadError);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadError}` },
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
    const cloudinaryId = searchParams.get('cloudinaryId');

    if (!cloudinaryId) {
      return NextResponse.json(
        { error: 'Cloudinary ID required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const { deleteFromCloudinary } = await import('@/lib/upload/cloudinary');
    await deleteFromCloudinary(cloudinaryId);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
