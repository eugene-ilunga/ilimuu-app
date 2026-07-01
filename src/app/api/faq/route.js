import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import FAQ from '@/app/model/faqModel';

// GET - Fetch all FAQs
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const category = searchParams.get('category');

    let query = {};
    if (activeOnly) {
      query.isActive = true;
    }
    if (category && category !== 'Tous') {
      query.category = category;
    }

    // Fetch FAQs sorted by display order
    const faqs = await FAQ.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ 
      success: true,
      data: faqs,
      count: faqs.length 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new FAQ
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Validate required fields
    if (!data.question || !data.answer) {
      return NextResponse.json({ 
        success: false,
        error: 'Question and answer are required' 
      }, { status: 400 });
    }

    const newFAQ = await FAQ.create(data);

    return NextResponse.json({ 
      success: true,
      data: newFAQ,
      message: 'FAQ created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update a FAQ
export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ 
        success: false,
        error: 'FAQ ID is required' 
      }, { status: 400 });
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return NextResponse.json({ 
        success: false,
        error: 'FAQ not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: updatedFAQ,
      message: 'FAQ updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a FAQ
export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'FAQ ID is required' 
      }, { status: 400 });
    }

    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return NextResponse.json({ 
        success: false,
        error: 'FAQ not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'FAQ deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

