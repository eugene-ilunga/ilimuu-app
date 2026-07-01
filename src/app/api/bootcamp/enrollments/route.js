import { NextResponse } from "next/server";
import EnrollBootcamp from "../../../model/enrollBootcampModel";
import Bootcamp from "../../../model/bootcampModel";
import User from "../../../model/userModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Get enrollments for a bootcamp
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    await connectToDB();

    let query = {};
    if (bootcampId) {
      query.bootcampId = new ObjectId(bootcampId);
    }
    if (status) {
      query.enrollment_status = status;
    }

    const total = await EnrollBootcamp.countDocuments(query);
    
    const enrollments = await EnrollBootcamp.find(query)
      .populate({
        path: "bootcampId",
        select: "title start_date end_date",
        model: Bootcamp,
      })
      .populate({
        path: "userId",
        select: "name email image",
        model: User,
      })
      .sort({ application_date: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json({
      status: 200,
      message: "Enrollments fetched successfully",
      data: enrollments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Update enrollment status
export async function POST(req) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    const enrollmentId = formData.get("enrollmentId");
    const newStatus = formData.get("status");
    const notes = formData.get("notes") || "";

    if (!enrollmentId || !newStatus) {
      return NextResponse.json({
        status: 400,
        message: "Enrollment ID and status are required",
      });
    }

    await connectToDB();

    const enrollment = await EnrollBootcamp.findByIdAndUpdate(
      enrollmentId,
      { 
        enrollment_status: newStatus,
        notes: {
          ...notes,
          admin_notes: notes,
          updated_by: userId,
          updated_at: new Date(),
        },
      },
      { new: true }
    ).populate({
      path: "bootcampId",
      select: "title",
      model: Bootcamp,
    }).populate({
      path: "userId",
      select: "name email",
      model: User,
    });

    if (!enrollment) {
      return NextResponse.json({
        status: 404,
        message: "Enrollment not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Enrollment status updated successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Get enrollment statistics
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const bootcampId = formData.get("bootcampId");

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    await connectToDB();

    let matchQuery = {};
    if (bootcampId) {
      matchQuery.bootcampId = new ObjectId(bootcampId);
    }

    const stats = await EnrollBootcamp.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$enrollment_status",
          count: { $sum: 1 },
        },
      },
    ]);

    const enrollmentStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
      completed: 0,
      dropped: 0,
    };

    stats.forEach((stat) => {
      enrollmentStats.total += stat.count;
      enrollmentStats[stat._id] = stat.count;
    });

    // Get recent enrollments
    const recentEnrollments = await EnrollBootcamp.find(matchQuery)
      .populate({
        path: "bootcampId",
        select: "title",
        model: Bootcamp,
      })
      .populate({
        path: "userId",
        select: "name email",
        model: User,
      })
      .sort({ application_date: -1 })
      .limit(5);

    return NextResponse.json({
      status: 200,
      message: "Enrollment statistics fetched successfully",
      data: {
        stats: enrollmentStats,
        recentEnrollments,
      },
    });
  } catch (error) {
    console.error("Error fetching enrollment statistics:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
