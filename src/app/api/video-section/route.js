import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import VideoSection from '@/app/model/videoSectionModel';

// GET - Fetch video section content
export async function GET(req) {
  try {
    await connectToDB();

    // Get the first (and should be only) video section document
    let videoSection = await VideoSection.findOne();

    // If no document exists, create one with default values
    if (!videoSection) {
      videoSection = await VideoSection.create({
        badge: 'Our about us',
        title: '🎉 40% OFF for the First 100 Customers!',
        description: 'Be among the first 100 to grab this exclusive deal and save 40% on your purchase. Don\'t miss out—once the slots are gone, the offer ends! 🚀',
        videoUrl: 'https://youtu.be/6lwh_jfLn2g',
        button1Text: 'Join With Us',
        button1Link: '/about',
        button2Text: 'Our Courses',
        button2Link: '/courselist',
        isActive: true,
      });
    }

    return NextResponse.json({ 
      success: true,
      data: videoSection
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching video section:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create video section content (if none exists)
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Check if a video section already exists
    const existingSection = await VideoSection.findOne();
    
    if (existingSection) {
      return NextResponse.json({ 
        success: false,
        error: 'Video section already exists. Use PUT to update.' 
      }, { status: 400 });
    }

    const newVideoSection = await VideoSection.create(data);

    return NextResponse.json({ 
      success: true,
      data: newVideoSection,
      message: 'Video section created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating video section:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update video section content
export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Video section ID is required' 
      }, { status: 400 });
    }

    const updatedVideoSection = await VideoSection.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedVideoSection) {
      return NextResponse.json({ 
        success: false,
        error: 'Video section not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: updatedVideoSection,
      message: 'Video section updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating video section:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

