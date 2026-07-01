import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream';

// Configure Cloudinary with server-side environment variables
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Remove NEXT_PUBLIC_ prefix
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, // Remove NEXT_PUBLIC_ prefix
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET, // Remove NEXT_PUBLIC_ prefix
  });
  
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') || formData.get('image')
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    // Determine resource type based on file type
    const fileType = file.type || '';
    const fileName = file.name?.toLowerCase() || '';
    
    let resourceType = 'auto';
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      resourceType = 'raw';
    } else if (fileType.startsWith('video/') || /\.(mp4|avi|mov|quicktime|webm|mkv)$/i.test(fileName)) {
      resourceType = 'video';
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: process.env.CLOUDINARY_CLOUD_PRESET,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      readableStream.pipe(uploadStream);
    });

    return NextResponse.json({
      status: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({
        status: false,
        error: 'File upload failed' }, { status: 500 });
  }
}