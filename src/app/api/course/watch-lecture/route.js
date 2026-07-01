import { NextResponse } from "next/server";
import Lecture from "@/app/model/lectureModel";
import EnrollCourse from "@/app/model/enrollCourseModel";
import { connectToDB } from "@/utils/database";

export async function POST(req, res) {
  const formdata = await req.formData();

  try {
    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const courseID = formdata.get("courseid");
    const userID = formdata.get("userid"); // Pass user ID to get progress

    if (!courseID || !userID) {
      return NextResponse.json({
        status: 400,
        message: "Course ID and User ID are required",
      });
    }

    await connectToDB();

    // Fetch the user's enrollment data for the course
    const enrollment = await EnrollCourse.findOne({
      courseId: courseID,
      userId: userID,
    }).lean();

    if (!enrollment) {
      return NextResponse.json({
        status: 404,
        message: "User is not enrolled in this course",
      });
    }

    const total = await Lecture.countDocuments({ course: courseID });

    // Fetch lectures with pagination
    const lectures = await Lecture.find({ course: courseID })
      .limit(limit)
      .skip((pageNumber - 1) * limit)
      .lean();

    // Map lectures to include progress data if available
    const lectureListWithProgress = lectures.map((lecture) => {
      const lectureProgress = enrollment?.lecturesProgress.find(
        (progress) => progress.lectureId.toString() === lecture._id.toString()
      );

      return {
        ...lecture,
        watchedPercentage: lectureProgress?.watchedPercentage || 0,
        lastWatched: lectureProgress?.lastWatched || null,
      };
    });

    return NextResponse.json({
      status: 200,
      message: "Enroll Lecture List with Progress",
      data: lectureListWithProgress,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
