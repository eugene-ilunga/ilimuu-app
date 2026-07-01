import { NextResponse } from "next/server";
import MentorReview from "@/app/model/mentorReview";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const mentorId = formData.get("mentorId");
    const userId = formData.get("userId");
    const rating = formData.get("rating");
    const review = formData.get("review");

    await connectToDB();

    const mentorReview = await MentorReview.create({
      mentorId,
      userId,
      rating,
      review,
    });

    return NextResponse.json({ status: true, message: "Mentor review added" });
  } catch (error) {
    console.error("Error adding course review:", error);
    return NextResponse.json(
      { status: false, error: "Error adding course review" },
      { status: 500 }
    );
  }
}
