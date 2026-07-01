import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { userName, isModerator, roomName } = await req.json();

  if (!roomName) {
    return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
  }

  // Use environment variables instead of reading from filesystem
  const apiKey = process.env.JITSI_API_KEY; // Remove NEXT_PUBLIC_ prefix
  const appId = process.env.JITSI_APP_ID; // Remove NEXT_PUBLIC_ prefix
  const privateKey = process.env.JITSI_PRIVATE_KEY; // Store private key as environment variable

  // Validate required environment variables
  if (!apiKey || !appId || !privateKey) {
    console.error('Missing required Jitsi environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const payload = {
    aud: 'jitsi',
    iss: "chat",
    sub: appId,
    room: roomName,
    context: {
      user: {
        name: userName || 'Guest',
        avatar: 'https://gravatar.com/avatar/abc123',
        email: 'guest@example.com',
        moderator: isModerator === true || isModerator === 'true',
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true',
        'outbound-call': 'true',
        'sip-outbound-call': 'false',
      },
    },
  };

  const options = {
    algorithm: 'RS256',
    expiresIn: '1h',
    keyid: apiKey, // Replace with your actual Key ID from JaaS Console
  };

  try {
    const token = jwt.sign(payload, privateKey, options);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('JWT Error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
