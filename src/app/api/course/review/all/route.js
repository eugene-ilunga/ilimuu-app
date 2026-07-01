import { NextResponse } from "next/server";
import CourseReview from "@/app/model/courseReview";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const formData = await req.formData();
  const course = formData.get("course");
  const page = parseInt(formData.get("page")) || 1;
  const pagination = parseInt(formData.get("pagination")) || 5;

  try {
    await connectToDB();

    // Ensure course is properly formatted
    const formattedCourseId = new ObjectId(String(course));

    // Count total reviews for the specific course
    const total = await CourseReview.countDocuments({ course: formattedCourseId });

    // Fetch reviews with pagination and populate user details
    const courseReviews = await CourseReview.find({ course: formattedCourseId })
      .populate({
        path: "user",
        select: "_id name image",
        model: User,
      })
      .limit(pagination)
      .skip((page - 1) * pagination)
      .sort({ createdAt: -1 });

    // Calculate average rating for the course
    const averageRatingResult = await CourseReview.aggregate([
      { $match: { course: formattedCourseId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      averageRatingResult.length > 0 ? averageRatingResult[0].averageRating : 0;

    return NextResponse.json({
      status: true,
      courseReviews,
      total,
      averageRating: averageRating.toFixed(2), // Round to 2 decimal places
    });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    return NextResponse.json(
      { status: false, error: "Error fetching course reviews" },
      { status: 500 }
    );
  }
}
