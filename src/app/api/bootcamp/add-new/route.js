import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";

// Validation function for bootcamp fields
async function validateFields(data) {
  const errors = [];

  // Required fields validation
  const requiredFields = [
    'title', 'short_description', 'description', 'thumbnail', 'overview_video',
    'category', 'subCategory', 'price', 'duration_weeks', 'start_date', 'end_date',
    'application_deadline', 'language', 'max_students', 'bootcamp_type', 'days_per_week', 'hours_per_day'
  ];

  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  }

  // Date validation
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const applicationDeadline = new Date(data.application_deadline);
  const currentDate = new Date();

  if (startDate <= currentDate) {
    errors.push("Start date must be in the future");
  }

  if (endDate <= startDate) {
    errors.push("End date must be after start date");
  }

  if (applicationDeadline >= startDate) {
    errors.push("Application deadline must be before start date");
  }

  // Numeric validations
  if (data.duration_weeks < 4) {
    errors.push("Duration must be at least 4 weeks");
  }

  if (data.max_students < 5 || data.max_students > 100) {
    errors.push("Maximum students must be between 5 and 100");
  }

  if (data.days_per_week < 3 || data.days_per_week > 7) {
    errors.push("Days per week must be between 3 and 7");
  }

  if (data.hours_per_day < 2 || data.hours_per_day > 8) {
    errors.push("Hours per day must be between 2 and 8");
  }

  return errors;
}

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    
    // Get cookies safely
    let role = "";
    let userId = "";
    try {
      const cookieStore = await cookies();
      role = cookieStore.get("role")?.value || "";
      userId = cookieStore.get("user_id")?.value || "";
    } catch (error) {
      console.log("Cookie parsing error:", error);
    }

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    // Extract form data
    const bootcampData = {
      title: formdata.get("title"),
      short_description: formdata.get("short_description"),
      description: formdata.get("description"),
      thumbnail: formdata.get("thumbnail"),
      overview_video: formdata.get("overview_video"),
      category: formdata.get("category"),
      subCategory: formdata.get("subCategory"),
      price: parseFloat(formdata.get("price")) || 0,
      discount: parseFloat(formdata.get("discount")) || 0,
      duration_weeks: parseInt(formdata.get("duration_weeks")) || 0,
      start_date: formdata.get("start_date"),
      end_date: formdata.get("end_date"),
      application_deadline: formdata.get("application_deadline"),
      instructor: userId, // Set current user as instructor
      level: formdata.get("level") || "all level",
      language: formdata.get("language"),
      max_students: parseInt(formdata.get("max_students")) || 0,
      bootcamp_type: formdata.get("bootcamp_type"),
      days_per_week: parseInt(formdata.get("days_per_week")) || 0,
      hours_per_day: parseInt(formdata.get("hours_per_day")) || 0,
      requirements: formdata.get("requirements") ? JSON.parse(formdata.get("requirements")) : [],
      outcomes: formdata.get("outcomes") ? JSON.parse(formdata.get("outcomes")) : [],
      bootcamp_tags: formdata.get("bootcamp_tags") ? JSON.parse(formdata.get("bootcamp_tags")) : [],
      prerequisites: formdata.get("prerequisites") ? JSON.parse(formdata.get("prerequisites")) : [],
      tools_and_technologies: formdata.get("tools_and_technologies") ? JSON.parse(formdata.get("tools_and_technologies")) : [],
      bootcamp_badge: formdata.get("bootcamp_badge") || "new",
      certification: formdata.get("certification") === "true",
      bootcamp_includes: formdata.get("bootcamp_includes") ? JSON.parse(formdata.get("bootcamp_includes")) : [],
    };

    // Parse phases if provided
    if (formdata.get("phases")) {
      bootcampData.phases = JSON.parse(formdata.get("phases"));
    }

    // Parse schedule class times if provided
    if (formdata.get("class_times")) {
      bootcampData.schedule = {
        days_per_week: bootcampData.days_per_week,
        hours_per_day: bootcampData.hours_per_day,
        class_times: JSON.parse(formdata.get("class_times")),
      };
    } else {
      bootcampData.schedule = {
        days_per_week: bootcampData.days_per_week,
        hours_per_day: bootcampData.hours_per_day,
        class_times: [],
      };
    }

    // Parse career support options
    bootcampData.career_support = {
      job_placement_assistance: formdata.get("job_placement_assistance") === "true",
      resume_review: formdata.get("resume_review") === "true",
      interview_preparation: formdata.get("interview_preparation") === "true",
      portfolio_building: formdata.get("portfolio_building") === "true",
    };

    // Parse co-instructors if provided
    if (formdata.get("co_instructors")) {
      bootcampData.co_instructors = JSON.parse(formdata.get("co_instructors"));
    }

    // Validate the data
    const validationErrors = await validateFields(bootcampData);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        status: 400,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    await connectToDB();

    // Check for duplicate bootcamp title
    const existingBootcamp = await Bootcamp.findOne({ title: bootcampData.title });
    if (existingBootcamp) {
      return NextResponse.json({
        status: 409,
        message: "A bootcamp with this title already exists",
      });
    }

    // Set status based on role
    if (role === "admin") {
      bootcampData.status = "approved";
    } else {
      bootcampData.status = "pending"; // Require admin approval for instructors
    }

    // Create the bootcamp
    const newBootcamp = new Bootcamp(bootcampData);
    const savedBootcamp = await newBootcamp.save();

    return NextResponse.json({
      status: 201,
      message: "Bootcamp created successfully",
      data: savedBootcamp,
    });

  } catch (error) {
    console.error("Error creating bootcamp:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
