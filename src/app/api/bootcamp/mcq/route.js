import { NextResponse } from "next/server";
import BootcampMCQ from "../../../model/bootcampMCQModel";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";

// GET - Get all MCQ questions for a bootcamp
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const includeInactive = searchParams.get("includeInactive") === "true";

    await connectToDB();

    const query = {};
    if (bootcampId) {
      query.bootcamp = bootcampId;
    }
    if (!includeInactive) {
      query.isActive = true;
    }

    const mcqs = await BootcampMCQ.find(query)
      .populate("bootcamp", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      status: 200,
      message: "MCQ questions retrieved successfully",
      data: mcqs,
    });
  } catch (error) {
    console.error("Error fetching MCQ questions:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// POST - Create a new MCQ question
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";
    const role = cookieStore.get("role")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    // Only admin can add MCQ questions
    if (role !== "admin") {
      return NextResponse.json({
        status: 403,
        message: "Only admin can add MCQ questions",
      });
    }

    const body = await req.json();
    const { bootcamp, question, options, points, level, explanation } = body;

    // Validation
    if (!bootcamp || !question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp, question, and at least 2 options are required",
      });
    }

    // Validate that exactly one option is correct
    const correctOptions = options.filter((opt) => opt.isCorrect);
    if (correctOptions.length !== 1) {
      return NextResponse.json({
        status: 400,
        message: "Exactly one option must be marked as correct",
      });
    }

    // Validate options have text
    if (options.some((opt) => !opt.text || opt.text.trim() === "")) {
      return NextResponse.json({
        status: 400,
        message: "All options must have text",
      });
    }

    await connectToDB();

    // Verify bootcamp exists
    const bootcampExists = await Bootcamp.findById(bootcamp);
    if (!bootcampExists) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    const newMCQ = new BootcampMCQ({
      bootcamp,
      question: question.trim(),
      options: options.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect || false,
      })),
      points: points || 1,
      level: level || "medium",
      explanation: explanation || "",
      createdBy: userId,
      isActive: true,
    });

    const savedMCQ = await newMCQ.save();

    return NextResponse.json({
      status: 201,
      message: "MCQ question created successfully",
      data: savedMCQ,
    });
  } catch (error) {
    console.error("Error creating MCQ question:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

