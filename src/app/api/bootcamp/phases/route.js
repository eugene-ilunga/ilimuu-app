import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Get bootcamp phases
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");

    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    const bootcamp = await Bootcamp.findById(bootcampId).select("phases title");
    
    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Phases fetched successfully",
      data: {
        bootcampId: bootcamp._id,
        title: bootcamp.title,
        phases: bootcamp.phases || [],
      },
    });
  } catch (error) {
    console.error("Error fetching phases:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Add or update phases
export async function POST(req) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    const bootcampId = formData.get("bootcampId");
    const phasesData = JSON.parse(formData.get("phases") || "[]");

    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    // Validate phases data
    const validatedPhases = phasesData.map((phase, index) => ({
      phase_number: index + 1,
      title: phase.title || `Phase ${index + 1}`,
      description: phase.description || "",
      duration_weeks: parseInt(phase.duration_weeks) || 1,
      learning_objectives: phase.learning_objectives || [],
      projects: phase.projects || [],
    }));

    const bootcamp = await Bootcamp.findByIdAndUpdate(
      bootcampId,
      { phases: validatedPhases },
      { new: true }
    );

    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Phases updated successfully",
      data: bootcamp.phases,
    });
  } catch (error) {
    console.error("Error updating phases:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Add single phase
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    const bootcampId = formData.get("bootcampId");
    const phaseData = {
      title: formData.get("title"),
      description: formData.get("description"),
      duration_weeks: parseInt(formData.get("duration_weeks")) || 1,
      learning_objectives: JSON.parse(formData.get("learning_objectives") || "[]"),
      projects: JSON.parse(formData.get("projects") || "[]"),
    };

    if (!bootcampId || !phaseData.title) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID and phase title are required",
      });
    }

    await connectToDB();

    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    const newPhase = {
      phase_number: (bootcamp.phases?.length || 0) + 1,
      ...phaseData,
    };

    bootcamp.phases = [...(bootcamp.phases || []), newPhase];
    await bootcamp.save();

    return NextResponse.json({
      status: 200,
      message: "Phase added successfully",
      data: newPhase,
    });
  } catch (error) {
    console.error("Error adding phase:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Delete phase
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const phaseNumber = parseInt(searchParams.get("phaseNumber"));

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    if (!bootcampId || !phaseNumber) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID and phase number are required",
      });
    }

    await connectToDB();

    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    // Remove the phase and renumber remaining phases
    bootcamp.phases = bootcamp.phases
      .filter(phase => phase.phase_number !== phaseNumber)
      .map((phase, index) => ({
        ...phase,
        phase_number: index + 1,
      }));

    await bootcamp.save();

    return NextResponse.json({
      status: 200,
      message: "Phase deleted successfully",
      data: bootcamp.phases,
    });
  } catch (error) {
    console.error("Error deleting phase:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
