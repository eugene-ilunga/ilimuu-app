import { NextResponse } from "next/server";
import EnrollCourse from "@/app/model/enrollCourseModel";
import Lecture from "@/app/model/lectureModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const formdata = await req.formData();
    const courseId = formdata.get("courseId");
    const lectureId = formdata.get("lectureId");
    const watchedDuration = parseFloat(formdata.get("watchedDuration"));
    const totalDuration = parseFloat(formdata.get("totalDuration"));
    const cookiesStore = await cookies();
    const userId = formdata.get("userId") || cookiesStore.get("user_id")?.value;

    // Validate required fields
    if (!userId || !courseId || !lectureId || isNaN(watchedDuration) || isNaN(totalDuration)) {
      return NextResponse.json({
        status: 400,
        message: "Missing or invalid fields",
      });
    }

    // Connect to the database
    await connectToDB();

    // Calculate watched percentage
    const watchedPercentage = (watchedDuration / totalDuration) * 100;

    // Find the enrolled course
    const enrolledCourse = await EnrollCourse.findOne({
      userId,
      courseId,
    });

    if (!enrolledCourse) {
      return NextResponse.json({
        status: 404,
        message: "User is not enrolled in this course",
      });
    }

    // Track if progress was updated
    let progressUpdated = false;

    // Find the lecture in the lecturesProgress array
    const lectureIndex = enrolledCourse.lecturesProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      // Lecture exists, update only if the new progress is higher
      if (watchedPercentage > enrolledCourse.lecturesProgress[lectureIndex].watchedPercentage) {
        enrolledCourse.lecturesProgress[lectureIndex].watchedPercentage = watchedPercentage;
        enrolledCourse.lecturesProgress[lectureIndex].lastWatched = new Date();
        progressUpdated = true;
      }
    } else {
      // Lecture does not exist, add new entry
      enrolledCourse.lecturesProgress.push({
        lectureId,
        watchedPercentage,
        lastWatched: new Date(),
      });
      progressUpdated = true;
    }

    // Recalculate overall course progress if there's an update
    if (progressUpdated) {
      // Fetch all lectures for the course
      const lectures = await Lecture.find({ course: courseId });

      // Calculate total duration of all lectures
      const totalCourseDuration = lectures.reduce((acc, lecture) => {
        return acc + parseFloat(lecture.duration || 0);
      }, 0);

      // Calculate total watched duration from enrolled lectures
      const totalWatchedDuration = enrolledCourse.lecturesProgress.reduce((acc, lectureProgress) => {
        const lecture = lectures.find((lec) => lec._id.toString() === lectureProgress.lectureId.toString());
        if (lecture) {
          return acc + (lectureProgress.watchedPercentage / 100) * parseFloat(lecture.duration || 0);
        }
        return acc;
      }, 0);

      // Calculate overall course progress as a percentage
      enrolledCourse.progress = totalCourseDuration
        ? (totalWatchedDuration / totalCourseDuration) * 100
        : 0;

      // Mark as completed if progress is 100%
      enrolledCourse.completed = enrolledCourse.progress === 100;

      // Update last accessed time
      enrolledCourse.lastAccessed = new Date();

      // Save changes
      await enrolledCourse.save();
    }

    return NextResponse.json({
      status: 200,
      message: progressUpdated
        ? "Lecture progress updated successfully"
        : "No update required as new progress is not greater than previous",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
