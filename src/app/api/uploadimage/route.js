import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    console.log('Params to Sign:', paramsToSign);
    console.log('API Secret:', process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET);

    // Ensure the parameters are in the correct format and include the timestamp
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign, 
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
    );

    console.log('Generated Signature:', signature);

    return new Response(JSON.stringify({ signature }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate signature' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
}
