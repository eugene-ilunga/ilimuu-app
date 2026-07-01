import { NextResponse } from "next/server";
import Lecture from "../../model/lectureModel";
import { connectToDB } from "../../../utils/database";
import Course from "../../model/courseModel";
import User from "../../model/userModel";

export async function POST(req, res) {
  const formdata = await req.formData();

  try {
    const limit = formdata.get("pagination") || 5;
    const pageNumber = formdata.get("page") || 1;
    const courseID = formdata.get("courseid");

    await connectToDB();

    const course = await Course.findOne({ _id: courseID }).populate({
      path: "instructor",
      select: " _id name image profession about",
      model: User,
    })
    .select("title short_description duration  updatedAt")
    .lean()
    .exec()
    ;
    const total = await Lecture.countDocuments({ course: courseID });
    const lecture = await Lecture.find({ course: courseID })
      .limit(limit)
      .skip((pageNumber - 1) * limit); // find all users and exclude password field
    return NextResponse.json({
      status: 200,
      message: "Course Lecture",
      data: lecture,
      course: course,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
