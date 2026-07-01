import { NextResponse } from "next/server";
import CourseReview from "@/app/model/courseReview";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const course = formData.get("course");
    const user = formData.get("user");
    const rating = formData.get("rating");
    const review = formData.get("review");

    await connectToDB();

    const courseReview = await CourseReview.create({
      course,
      user,
      rating,
      review,
    });

    return NextResponse.json({ status: true, message: "Course review added" });
  } catch (error) {
    console.error("Error adding course review:", error);
    return NextResponse.json(
      { status: false, error: "Error adding course review" },
      { status: 500 }
    );
  }
}
