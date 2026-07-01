import { NextResponse } from "next/server";
import EnrollCourse from "@/app/model/enrollCourseModel";
import Course from "@/app/model/courseModel";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { cookies } from "next/headers";

export async function POST(req, res) {
  const formdata = await req.formData();
  const cookiesStore = await cookies(); // call it once
  const limit = parseInt(formdata.get("pagination")) || 10;
  const pageNumber = parseInt(formdata.get("page")) || 1;
  const user_id = formdata.get("user_id") || cookiesStore.get("user_id")?.value;
  const isCompleted = formdata.get("isCompleted") || false;

  try {
    await connectToDB();

    const total = await EnrollCourse.countDocuments({userId: user_id, completed: isCompleted
    });
    const enrollList = await EnrollCourse.find({userId: user_id, completed: isCompleted})
      .populate({ path: "userId", select: "_id name", model: User })
      .populate({
        path: "courseId",
        select: "_id title thumbnail",
        model: Course,
        populate: {
            path: "instructor", // Populate the instructor details
            select: "_id name image",
            model: User,
          },
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    return NextResponse.json({
        status: 200,
        message: "Enroll list fetched successfully",
         enrollList,
        total,
        });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
