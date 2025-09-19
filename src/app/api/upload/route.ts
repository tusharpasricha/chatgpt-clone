import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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
      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/csv',
        'application/json',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File size must be less than ${maxSize / (1024 * 1024)}MB` },
          { status: 400 }
        );
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'File type not supported' },
          { status: 400 }
        );
      }

      try {
        // For now, create a data URL for the file (this is temporary)
        // In production, you would upload to a cloud storage service
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Create attachment object
        const attachment = {
          id: uuidv4(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file' as const,
          url: dataUrl, // Using data URL for now
          size: file.size,
          mimeType: file.type,
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
