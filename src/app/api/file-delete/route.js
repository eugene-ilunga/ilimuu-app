import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  });

export  async function POST(req, res) {

    const formData = await req.formData();
    const fileUrl = formData.get('fileUrl');

    // Check if fileUrl is provided
    if (!fileUrl) {
      return NextResponse.json({status: 500, error: 'Image URL is required' });
    }

    try {
      // Extract the public ID from the image URL
      const publicId = extractPublicId(fileUrl);
      
      // If publicId could not be extracted
      if (!publicId) {
        return NextResponse.json({status:500, error: 'Invalid Cloudinary URL' });
      }

      // Delete the image using the extracted public ID
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        return NextResponse.json({status:500, error: 'Failed to delete image' });
      }

      return NextResponse.json({ status:200, message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      return NextResponse.json({ status:500, error: 'Server error'+error.message });
    }
  } 

// Utility function to extract public ID from Cloudinary URL
function extractPublicId(url) {
  // Use regex to capture the public ID part of the URL
  const regex = /\/v\d+\/([^\/]+)\.[a-z]+$/;
  const match = url.match(regex);
  
  // Return the public ID if found
  return match ? match[1] : null;
}
