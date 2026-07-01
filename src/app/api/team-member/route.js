import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import TeamMember from '@/app/model/teamMemberModel';

// GET - Fetch all team members
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query = {};
    if (activeOnly) {
      query.isActive = true;
    }

    // Fetch team members sorted by display order
    const teamMembers = await TeamMember.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ 
      success: true,
      data: teamMembers,
      count: teamMembers.length 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new team member
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.position) {
      return NextResponse.json({ 
        success: false,
        error: 'Name and position are required' 
      }, { status: 400 });
    }

    const newTeamMember = await TeamMember.create(data);

    return NextResponse.json({ 
      success: true,
      data: newTeamMember,
      message: 'Team member created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update a team member
export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Team member ID is required' 
      }, { status: 400 });
    }

    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTeamMember) {
      return NextResponse.json({ 
        success: false,
        error: 'Team member not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: updatedTeamMember,
      message: 'Team member updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a team member
export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'Team member ID is required' 
      }, { status: 400 });
    }

    const deletedTeamMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedTeamMember) {
      return NextResponse.json({ 
        success: false,
        error: 'Team member not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Team member deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

