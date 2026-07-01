import { NextResponse } from "next/server";
import BootcampMCQ from "../../../../model/bootcampMCQModel";
import BootcampExamResult from "../../../../model/bootcampExamResultModel";
import EnrollBootcamp from "../../../../model/enrollBootcampModel";
import { connectToDB } from "../../../../../utils/database";
import { cookies } from "next/headers";

// GET - Get exam questions for a student (without correct answers)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    // Check if student is enrolled
    const enrollment = await EnrollBootcamp.findOne({
      bootcampId,
      userId,
      enrollment_status: { $in: ["approved", "accepted"] },
    });

    if (!enrollment) {
      return NextResponse.json({
        status: 403,
        message: "You must be enrolled in this bootcamp to take the exam",
      });
    }

    // Get active MCQ questions for this bootcamp
    const mcqs = await BootcampMCQ.find({
      bootcamp: bootcampId,
      isActive: true,
    }).select("question options points");

    // Remove correct answer indicators from options
    const questions = mcqs.map((mcq) => ({
      _id: mcq._id,
      question: mcq.question,
      options: mcq.options.map((opt) => ({
        text: opt.text,
        // Don't include isCorrect for students
      })),
      points: mcq.points,
    }));

    return NextResponse.json({
      status: 200,
      message: "Exam questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// POST - Submit exam answers
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    const body = await req.json();
    const { bootcampId, answers, startedAt } = body;

    if (!bootcampId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID and answers are required",
      });
    }

    await connectToDB();

    // Check if student is enrolled
    const enrollment = await EnrollBootcamp.findOne({
      bootcampId,
      userId,
      enrollment_status: { $in: ["approved", "accepted"] },
    });

    if (!enrollment) {
      return NextResponse.json({
        status: 403,
        message: "You must be enrolled in this bootcamp to take the exam",
      });
    }

    // Check if student has already taken the exam
    const existingResult = await BootcampExamResult.findOne({
      bootcamp: bootcampId,
      student: userId,
    });

    if (existingResult) {
      return NextResponse.json({
        status: 400,
        message: "You have already taken this exam",
      });
    }

    // Get all questions with correct answers
    const questionIds = answers.map((ans) => ans.question);
    const mcqs = await BootcampMCQ.find({
      _id: { $in: questionIds },
      bootcamp: bootcampId,
      isActive: true,
    });

    // Calculate results
    let correctAnswers = 0;
    let obtainedPoints = 0;
    let totalPoints = 0;

    const answerDetails = answers.map((answer) => {
      const question = mcqs.find((q) => q._id.toString() === answer.question);
      if (!question) {
        return null;
      }

      totalPoints += question.points;
      const selectedOption = question.options[answer.selectedOption];
      const isCorrect = selectedOption ? selectedOption.isCorrect : false;

      if (isCorrect) {
        correctAnswers++;
        obtainedPoints += question.points;
      }

      return {
        question: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    }).filter((ans) => ans !== null);

    const percentage = totalPoints > 0 ? (obtainedPoints / totalPoints) * 100 : 0;
    const timeSpent = startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) : 0;

    // Save exam result
    const examResult = new BootcampExamResult({
      bootcamp: bootcampId,
      student: userId,
      answers: answerDetails,
      totalQuestions: answerDetails.length,
      correctAnswers,
      totalPoints,
      obtainedPoints,
      percentage: Math.round(percentage * 100) / 100,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      submittedAt: new Date(),
      timeSpent,
    });

    const savedResult = await examResult.save();

    return NextResponse.json({
      status: 200,
      message: "Exam submitted successfully",
      data: {
        result: savedResult,
        correctAnswers,
        totalQuestions: answerDetails.length,
        percentage: Math.round(percentage * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

