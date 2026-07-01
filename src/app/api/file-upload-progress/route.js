import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  });

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file') || formData.get('image');
  
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await new Promise((resolve, reject) => {
          let uploadedBytes = 0;
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          readableStream.on('data', (chunk) => {
            uploadedBytes += chunk.length;
            const progress = Math.round((uploadedBytes / buffer.length) * 100);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress })}\n\n`));
          });

          readableStream.pipe(uploadStream);
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: true, url: result.secure_url, public_id: result.public_id })}\n\n`));
        controller.close();
      } catch (error) {
        console.error('File upload failed:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'File upload failed' })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
