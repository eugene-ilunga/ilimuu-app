import { NextResponse } from "next/server";
import EnrollBootcamp from "../../../model/enrollBootcampModel";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Get user's own bootcamp enrollments
export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    await connectToDB();

    // Find all bootcamp enrollments for the current user
    const enrollments = await EnrollBootcamp.find({ userId: new ObjectId(userId) })
      .populate({
        path: "bootcampId",
        select: "title description thumbnail start_date end_date duration instructor co_instructors schedule bootcamp_type",
        model: Bootcamp,
      })
      .sort({ application_date: -1 });

    // Transform the data to include bootcamp details
    const transformedEnrollments = enrollments.map(enrollment => ({
      _id: enrollment._id,
      bootcamp: enrollment.bootcampId,
      enrollment_status: enrollment.enrollment_status,
      application_date: enrollment.application_date,
      progress: enrollment.progress,
      notes: enrollment.notes,
      application_data: enrollment.application_data,
    }));

    return NextResponse.json({
      status: 200,
      message: "Bootcamp enrollments fetched successfully",
      data: transformedEnrollments,
    });
  } catch (error) {
    console.error("Error fetching user bootcamp enrollments:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
