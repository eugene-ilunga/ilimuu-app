import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import AboutPage from '@/app/model/aboutPageModel';

// GET - Fetch about page content
export async function GET() {
  try {
    await connectToDB();

    // Fetch the about page content (there should only be one document)
    let aboutPage = await AboutPage.findOne();

    // If no about page exists, create a default one
    if (!aboutPage) {
      aboutPage = await AboutPage.create({});
    }

    return NextResponse.json(aboutPage, { status: 200 });
  } catch (error) {
    console.error('Error fetching about page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or Update about page content
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Upsert AboutPage (create new if none exists, otherwise update)
    const updatedAboutPage = await AboutPage.findOneAndUpdate(
      {},
      data,
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn't exist
      }
    );

    return NextResponse.json(updatedAboutPage, { status: 200 });
  } catch (error) {
    console.error('Error updating about page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update about page content
export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();

    const updatedAboutPage = await AboutPage.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true }
    );

    if (!updatedAboutPage) {
      return NextResponse.json({ error: 'About page not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAboutPage, { status: 200 });
  } catch (error) {
    console.error('Error updating about page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

