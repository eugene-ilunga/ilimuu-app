import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') || formData.getAll('image');

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Function to upload a single file to Cloudinary
    const uploadToCloudinary = (file) => {
      return new Promise(async (resolve, reject) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        readableStream.pipe(uploadStream);
      });
    };

    // Upload all files concurrently
    const uploadPromises = files.map(uploadToCloudinary);
    const results = await Promise.all(uploadPromises);

    // Respond with URLs of all uploaded files
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    return NextResponse.json({
      status: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json(
      {
        status: false,
        error: 'File upload failed',
      },
      { status: 500 }
    );
  }
}
