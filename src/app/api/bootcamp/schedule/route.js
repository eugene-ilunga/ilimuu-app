import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Get bootcamp schedule and support settings
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

    const bootcamp = await Bootcamp.findById(bootcampId).select(
      "title schedule bootcamp_type career_support instructor co_instructors"
    );
    
    if (!bootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Schedule and support settings fetched successfully",
      data: {
        bootcampId: bootcamp._id,
        title: bootcamp.title,
        schedule: bootcamp.schedule || {},
        deliveryMethod: bootcamp.bootcamp_type || "",
        careerSupport: bootcamp.career_support || {},
        instructor: bootcamp.instructor,
        co_instructors: bootcamp.co_instructors || [],
      },
    });
  } catch (error) {
    console.error("Error fetching schedule and support:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Update schedule and support settings
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
    const scheduleData = JSON.parse(formData.get("schedule") || "{}");
    const deliveryMethod = formData.get("deliveryMethod");
    const careerSupportData = JSON.parse(formData.get("careerSupport") || "{}");

    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    // Transform schedule data to match model schema
    const transformedScheduleData = {
      days_per_week: scheduleData.days_per_week || 5,
      hours_per_day: scheduleData.hours_per_day || 8,
      class_times: (scheduleData.class_times || []).map(classTime => ({
        day: classTime.day?.toLowerCase() || "",
        start_time: classTime.start || "",
        end_time: classTime.end || "",
      })),
      break_times: (scheduleData.break_times || []).map(breakTime => ({
        start_time: breakTime.start || "",
        end_time: breakTime.end || "",
        description: breakTime.description || "",
      })),
      timezone: scheduleData.timezone || "UTC",
    };

    // Transform career support data to match model schema
    const transformedCareerSupport = {
      job_placement_assistance: careerSupportData.job_placement || false,
      resume_review: careerSupportData.resume_review || false,
      interview_preparation: careerSupportData.interview_prep || false,
      portfolio_building: careerSupportData.portfolio_review || false,
      networking_events: careerSupportData.networking_events || false,
      mentorship_program: careerSupportData.mentorship_program || false,
      career_counseling: careerSupportData.career_counseling || false,
      industry_connections: careerSupportData.industry_connections || false,
    };

    const updateData = {
      schedule: transformedScheduleData,
      bootcamp_type: deliveryMethod,
      career_support: transformedCareerSupport,
    };

    const bootcamp = await Bootcamp.findByIdAndUpdate(
      bootcampId,
      updateData,
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
      message: "Schedule and support settings updated successfully",
      data: {
        schedule: bootcamp.schedule,
        deliveryMethod: bootcamp.bootcamp_type,
        careerSupport: bootcamp.career_support,
      },
    });
  } catch (error) {
    console.error("Error updating schedule and support:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
