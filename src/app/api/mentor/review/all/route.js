import { NextResponse } from "next/server";
import MentorReview from "@/app/model/mentorReview";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";
import User from "@/app/model/userModel";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const mentorId = formData.get("mentorId");
    const page = parseInt(formData.get("page")) || 1;
    const pagination = parseInt(formData.get("pagination")) || 5;

    if (!mentorId) {
      return NextResponse.json({ status: false, error: "Mentor ID is required" }, { status: 400 });
    }

    // Convert mentorId to ObjectId
    const mentorObjectId = new ObjectId(String(mentorId));

    await connectToDB();

    // Count total reviews
    const total = await MentorReview.countDocuments({ mentorId: mentorObjectId });

    // Fetch reviews with pagination
    const mentorReview = await MentorReview.find({ mentorId: mentorObjectId })
      .populate({
        path: "userId",
        select: "_id name image",
        model: User,
      })
      .limit(pagination)
      .skip((page - 1) * pagination)
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRatingResult = await MentorReview.aggregate([
      { $match: { mentorId: mentorObjectId } }, // Match reviews by mentorId
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);

    // Handle the case where there are no ratings
    const averageRating = averageRatingResult.length > 0 ? averageRatingResult[0].averageRating : 0;

    return NextResponse.json({
      status: true,
      mentorReview,
      total,
      averageRating: parseFloat(averageRating.toFixed(2)), // Round to 2 decimal places
    });
  } catch (error) {
    console.error("Error fetching mentor reviews:", error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  }
}
