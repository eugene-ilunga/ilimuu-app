import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import User from "../../../model/userModel";
import Category from "../../../model/categoriesModel";
import EnrollBootcamp from "../../../model/enrollBootcampModel";
import { ObjectId } from "mongodb";

export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const bootcampId = formData.get("bootcampId");

    console.log("Bootcamp Details API - Received ID:", bootcampId);

    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();
    console.log("Database connected successfully");
    
    // Validate ObjectId format
    if (!ObjectId.isValid(bootcampId)) {
      console.log("Invalid ObjectId format:", bootcampId);
      return NextResponse.json({
        status: 400,
        message: "Invalid bootcamp ID format",
      });
    }
    
    const bootcamp = await Bootcamp.findOne({ _id: new ObjectId(bootcampId) })
      .populate({
        path: "instructor",
        select: "_id name image profession about",
        model: User,
      })
      .populate({
        path: "co_instructors",
        select: "_id name image profession about",
        model: User,
      })
      .populate({
        path: "category",
        select: "_id categoryName",
        model: Category,
      });

    console.log("Bootcamp found:", bootcamp ? "Oui" : "Non");
    if (bootcamp) {
      console.log("Bootcamp title:", bootcamp.title);
    }

    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    // Get enrollment statistics
    const enrollmentStats = await EnrollBootcamp.aggregate([
      { $match: { bootcampId: new ObjectId(bootcampId) } },
      {
        $group: {
          _id: "$applicationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total_applications: 0,
      accepted: 0,
      rejected: 0,
      waitlisted: 0,
      completed: 0,
      dropped: 0,
    };

    enrollmentStats.forEach((stat) => {
      stats.total_applications += stat.count;
      stats[stat._id] = stat.count;
    });

    // Calculate additional metrics
    const enrolledCount = bootcamp.enrolled_students?.length || 0;
    const availableSpots = bootcamp.max_students - enrolledCount;
    const isApplicationOpen = new Date() < new Date(bootcamp.application_deadline);
    const isUpcoming = new Date() < new Date(bootcamp.start_date);
    const isOngoing = new Date() >= new Date(bootcamp.start_date) && new Date() <= new Date(bootcamp.end_date);
    const isCompleted = new Date() > new Date(bootcamp.end_date);

    // Calculate duration in days
    const durationInDays = Math.ceil(
      (new Date(bootcamp.end_date) - new Date(bootcamp.start_date)) / (1000 * 60 * 60 * 24)
    );

    const bootcampWithMetrics = {
      ...bootcamp.toObject(),
      enrolled_count: enrolledCount,
      available_spots: availableSpots,
      is_application_open: isApplicationOpen,
      is_upcoming: isUpcoming,
      is_ongoing: isOngoing,
      is_completed: isCompleted,
      enrollment_percentage: Math.round((enrolledCount / bootcamp.max_students) * 100),
      duration_in_days: durationInDays,
      enrollment_stats: stats,
    };

    return NextResponse.json({
      status: 200,
      message: "Bootcamp details fetched successfully",
      data: bootcampWithMetrics,
    });
  } catch (error) {
    console.error("Error in bootcamp details route:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
