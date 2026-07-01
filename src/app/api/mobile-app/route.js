import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import MobileApp from '@/app/model/mobileAppModel';

// GET - Fetch mobile app page content
export async function GET() {
  try {
    await connectToDB();

    // Fetch the mobile app page content (there should only be one document)
    let mobileApp = await MobileApp.findOne();

    // If no mobile app page exists, create a default one
    if (!mobileApp) {
      mobileApp = await MobileApp.create({
        features: [
          {
            title: '1. Home Page',
            description: 'Welcome to our ELIMUU your gateway to high-quality learning. Browse expert-led courses, get lifetime access, and learn at your own pace.',
            image: '/assets/custom-image/App-HomePage.png',
            tags: [],
            displayOrder: 1,
            isActive: true,
          },
          {
            title: '2. Courses Page',
            description: 'Discover a wide range of expert-led courses designed to help you grow professionally and personally.',
            image: '/assets/custom-image/App-CoursePage.jpg',
            tags: [],
            displayOrder: 2,
            isActive: true,
          },
          {
            title: '3. Instructor Page',
            description: 'Our instructors are experienced professionals, passionate about teaching and committed to your success.',
            image: '/assets/custom-image/App-InstructorPage.jpg',
            tags: ['About', 'Cours', 'Reviews', 'Plans'],
            displayOrder: 3,
            isActive: true,
          },
          {
            title: '4. Community Page',
            description: 'The ELIMUU community page enables students to connect through group chats, share educational posts, like and comment on content.',
            image: '/assets/custom-image/App-CommunityPage.jpg',
            tags: ['Posts', 'Group Message', 'Like', 'Comment', 'Partager'],
            displayOrder: 4,
            isActive: true,
          },
          {
            title: '5. Other Pages',
            description: 'Provides access to extra features like app notifications, inviting friends, and selecting your preferred language.',
            image: '/assets/custom-image/App-OtherPages.png',
            tags: ['Change Language', 'Refer to your friends', 'Notifications', 'Wallet'],
            displayOrder: 5,
            isActive: true,
          },
          {
            title: '6. Instructor Dashboard',
            description: 'The Instructor Dashboard at ELIMUU provides a central hub for managing courses, tracking student progress.',
            image: '/assets/custom-image/App-MentorsDashboardPage.jpg',
            tags: ['Sales Summary', 'Financial Status', 'All Courses', 'Profil'],
            displayOrder: 6,
            isActive: true,
          },
        ],
      });
    }

    return NextResponse.json(mobileApp, { status: 200 });
  } catch (error) {
    console.error('Error fetching mobile app page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or Update mobile app page content
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Upsert MobileApp (create new if none exists, otherwise update)
    const updatedMobileApp = await MobileApp.findOneAndUpdate(
      {},
      data,
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn't exist
      }
    );

    return NextResponse.json(updatedMobileApp, { status: 200 });
  } catch (error) {
    console.error('Error updating mobile app page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update mobile app page content
export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();

    const updatedMobileApp = await MobileApp.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true }
    );

    if (!updatedMobileApp) {
      return NextResponse.json({ error: 'Mobile app page not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMobileApp, { status: 200 });
  } catch (error) {
    console.error('Error updating mobile app page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

