import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import Settings from '@/app/model/settingModel';

export async function POST(req) {
  try {
    await connectToDB();

    // Parse the incoming JSON data
    const data = await req.json();

    // Upsert Settings (create new if none exists, otherwise update)
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      data,
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn't exist
      }
    );

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();

    // Fetch the current settings (there should only be one document)
    const settings = await Settings.findOne();

    if (!settings) {
      return NextResponse.json({ message: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
