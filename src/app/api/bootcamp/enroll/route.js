import { NextResponse } from "next/server";
import EnrollBootcamp from "../../../model/enrollBootcampModel";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    const cookieStore = await cookies();

    const userId = cookieStore.get("user_id")?.value;
    console.log("Enrollment API - User ID:", userId);

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    const bootcampId = formdata.get("bootcampId");
    console.log("Enrollment API - Bootcamp ID:", bootcampId);
    
    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    // Check if bootcamp exists and is available for enrollment
    const bootcamp = await Bootcamp.findById(bootcampId);
    console.log("Enrollment API - Bootcamp found:", bootcamp ? "Oui" : "Non");
    if (bootcamp) {
      console.log("Enrollment API - Bootcamp title:", bootcamp.title);
    }
    
    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    // Check if applications are still open
    if (new Date() > new Date(bootcamp.application_deadline)) {
      return NextResponse.json({
        status: 400,
        message: "Application deadline has passed",
      });
    }

    // Check if bootcamp is completed
    if (bootcamp.status === "completed") {
      return NextResponse.json({
        status: 400,
        message: "This bootcamp has already been completed and is no longer accepting new enrollments",
      });
    }

    // Check if bootcamp is approved and active
    if (bootcamp.status !== "approved" && bootcamp.status !== "active") {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp is not available for enrollment",
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await EnrollBootcamp.findOne({
      bootcampId: bootcampId,
      userId: userId,
    });

    if (existingEnrollment) {
      return NextResponse.json({
        status: 409,
        message: "You are already enrolled in this bootcamp",
        data: existingEnrollment,
      });
    }

    // Check if bootcamp is full
    const currentEnrollments = await EnrollBootcamp.countDocuments({
      bootcampId: bootcampId,
      enrollment_status: { $in: ["accepted", "applied"] },
    });

    if (currentEnrollments >= bootcamp.max_students) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp is full. You can apply to be added to the waitlist.",
      });
    }

    // Extract application data
    const applicationData = {
      motivation_letter: formdata.get("motivation_letter"),
      experience_level: formdata.get("experience_level"),
      goals: formdata.get("goals"),
      availability: formdata.get("availability"),
      portfolio_url: formdata.get("portfolio_url") || "",
      linkedin_url: formdata.get("linkedin_url") || "",
      github_url: formdata.get("github_url") || "",
    };

    // Validate required application fields
    const requiredFields = ['motivation_letter', 'experience_level', 'goals', 'availability'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Initialize progress structure based on bootcamp phases
    const phasesProgress = bootcamp.phases.map(phase => ({
      phase_number: phase.phase_number,
      completion_percentage: 0,
      projects_completed: [],
    }));

    // Create enrollment record
    const enrollmentData = {
      bootcampId: bootcampId,
      userId: userId,
      application_data: applicationData,
      enrollment_status: "applied", // Default status
      progress: {
        overall_progress: 0,
        current_phase: 1,
        phases_progress: phasesProgress,
        attendance: {
          total_sessions: 0,
          attended_sessions: 0,
          attendance_percentage: 0,
        },
      },
    };

    const newEnrollment = new EnrollBootcamp(enrollmentData);
    const savedEnrollment = await newEnrollment.save();

    // Populate the saved enrollment with bootcamp and user details
    const populatedEnrollment = await EnrollBootcamp.findById(savedEnrollment._id)
      .populate({
        path: "bootcampId",
        select: "title instructor start_date end_date",
      })
      .populate({
        path: "userId",
        select: "name email",
      });

    return NextResponse.json({
      status: 201,
      message: "Application submitted successfully",
      data: populatedEnrollment,
    });

  } catch (error) {
    console.error("Error in bootcamp enrollment:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// GET method to retrieve enrollment status
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

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

    const enrollment = await EnrollBootcamp.findOne({
      bootcampId: bootcampId,
      userId: userId,
    }).populate({
      path: "bootcampId",
      select: "title start_date end_date application_deadline",
    });

    return NextResponse.json({
      status: 200,
      message: enrollment ? "Enrollment found" : "No enrollment found",
      data: enrollment,
      is_enrolled: !!enrollment,
    });

  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
