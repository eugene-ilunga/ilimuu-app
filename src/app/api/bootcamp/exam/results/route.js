import { NextResponse } from "next/server";
import BootcampExamResult from "../../../../model/bootcampExamResultModel";
import { connectToDB } from "../../../../../utils/database";
import { cookies } from "next/headers";

// GET - Get exam results
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const studentId = searchParams.get("studentId");

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";
    const role = cookieStore.get("role")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    await connectToDB();

    const query = {};

    // If admin/instructor, can see all results for a bootcamp
    if (role === "admin" || role === "instructor") {
      if (bootcampId) {
        query.bootcamp = bootcampId;
      }
      if (studentId) {
        query.student = studentId;
      }
    } else {
      // Students can only see their own results
      query.student = userId;
      if (bootcampId) {
        query.bootcamp = bootcampId;
      }
    }

    const results = await BootcampExamResult.find(query)
      .populate("bootcamp", "title")
      .populate("student", "name email")
      .populate({
        path: "answers.question",
        select: "question options explanation",
      })
      .sort({ submittedAt: -1 });

    return NextResponse.json({
      status: 200,
      message: "Exam results retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

