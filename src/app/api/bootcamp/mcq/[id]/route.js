import { NextResponse } from "next/server";
import BootcampMCQ from "../../../../model/bootcampMCQModel";
import { connectToDB } from "../../../../../utils/database";
import { cookies } from "next/headers";

// GET - Get a single MCQ question
export async function GET(req, { params }) {
  try {
    const { id } = params;

    await connectToDB();

    const mcq = await BootcampMCQ.findById(id)
      .populate("bootcamp", "title")
      .populate("createdBy", "name email");

    if (!mcq) {
      return NextResponse.json({
        status: 404,
        message: "MCQ question not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "MCQ question retrieved successfully",
      data: mcq,
    });
  } catch (error) {
    console.error("Error fetching MCQ question:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// PUT - Update an MCQ question
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";
    const role = cookieStore.get("role")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    // Only admin can update MCQ questions
    if (role !== "admin") {
      return NextResponse.json({
        status: 403,
        message: "Only admin can update MCQ questions",
      });
    }

    const body = await req.json();
    const { question, options, points, level, explanation, isActive } = body;

    await connectToDB();

    const mcq = await BootcampMCQ.findById(id);
    if (!mcq) {
      return NextResponse.json({
        status: 404,
        message: "MCQ question not found",
      });
    }

    // Update fields
    if (question !== undefined) {
      mcq.question = question.trim();
    }
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return NextResponse.json({
          status: 400,
          message: "At least 2 options are required",
        });
      }
      const correctOptions = options.filter((opt) => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return NextResponse.json({
          status: 400,
          message: "Exactly one option must be marked as correct",
        });
      }
      mcq.options = options.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect || false,
      }));
    }
    if (points !== undefined) {
      mcq.points = points;
    }
    if (level !== undefined) {
      mcq.level = level;
    }
    if (explanation !== undefined) {
      mcq.explanation = explanation;
    }
    if (isActive !== undefined) {
      mcq.isActive = isActive;
    }

    const updatedMCQ = await mcq.save();

    return NextResponse.json({
      status: 200,
      message: "MCQ question updated successfully",
      data: updatedMCQ,
    });
  } catch (error) {
    console.error("Error updating MCQ question:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// DELETE - Delete an MCQ question
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";
    const role = cookieStore.get("role")?.value || "";

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    // Only admin can delete MCQ questions
    if (role !== "admin") {
      return NextResponse.json({
        status: 403,
        message: "Only admin can delete MCQ questions",
      });
    }

    await connectToDB();

    const mcq = await BootcampMCQ.findByIdAndDelete(id);

    if (!mcq) {
      return NextResponse.json({
        status: 404,
        message: "MCQ question not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "MCQ question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting MCQ question:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

