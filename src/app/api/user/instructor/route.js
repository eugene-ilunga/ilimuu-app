import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";

// Get all instructors with count of courses
export async function GET(req) {
  try {
    await connectToDB();

    const instructors = await User.aggregate([
      {
        $match: {
          role: "instructor", // Only include users with instructor role
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "courses",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          profession: 1,
          coursesCount: { $size: "$courses" },
        },
      },
    ]);

    return NextResponse.json({
      status: 200,
      message: "Instructors fetched successfully",
      data: instructors,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
