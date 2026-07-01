import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Course from "@/app/model/courseModel";
import User from "@/app/model/userModel";

export async function POST(req) {
  const data = await req.formData();
  const query = data.get("search");

  try {
    await connectToDB();
    // Fetch courses
    const courseResults = await Course.find({
      title: { $regex: query, $options: "i" },
    })
      .select("title thumbnail")
      .limit(5); // Limit the results for performance

    // Fetch instructors
    const instructorResults = await User.find({
      name: { $regex: query, $options: "i" },
    })
      .select("name image")
      .limit(5);

    // Create a unified array with a `type` field to distinguish between course and instructor
    const results = [
      ...courseResults.map(course => ({
        type: 'course',
        name: course.title,
        thumbnail: course.thumbnail,
        id: course._id,
      })),
      ...instructorResults.map(instructor => ({
        type: 'instructor',
        name: instructor.name,
        thumbnail: instructor.image,
        id: instructor._id,
      }))
    ];

    return NextResponse.json(
      { status: 200, results },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 400, message: err.message },
      { status: 400 }
    );
  }
}
