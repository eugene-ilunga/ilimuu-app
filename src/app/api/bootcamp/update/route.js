import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";

// Validation function for bootcamp fields
async function validateFields(data) {
  const errors = [];

  // Date validation
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate <= startDate) {
      errors.push("End date must be after start date");
    }
  }

  if (data.application_deadline && data.start_date) {
    const applicationDeadline = new Date(data.application_deadline);
    const startDate = new Date(data.start_date);

    if (applicationDeadline >= startDate) {
      errors.push("Application deadline must be before start date");
    }
  }

  // Numeric validations
  if (data.duration_weeks && data.duration_weeks < 4) {
    errors.push("Duration must be at least 4 weeks");
  }

  if (data.max_students && (data.max_students < 5 || data.max_students > 100)) {
    errors.push("Maximum students must be between 5 and 100");
  }

  if (data.days_per_week && (data.days_per_week < 3 || data.days_per_week > 7)) {
    errors.push("Days per week must be between 3 and 7");
  }

  if (data.hours_per_day && (data.hours_per_day < 2 || data.hours_per_day > 8)) {
    errors.push("Hours per day must be between 2 and 8");
  }

  return errors;
}

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    const cookieStore = await cookies();

    const role = cookieStore.get("role")?.value;
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({
        status: 401,
        message: "Authentication required",
      });
    }

    const bootcampId = formdata.get("bootcampId");
    if (!bootcampId) {
      return NextResponse.json({
        status: 400,
        message: "Bootcamp ID is required",
      });
    }

    await connectToDB();

    // Find the existing bootcamp
    const existingBootcamp = await Bootcamp.findById(bootcampId);
    if (!existingBootcamp) {
      return NextResponse.json({
        status: 404,
        message: "Bootcamp not found",
      });
    }

    // Check permissions
    if (role !== "admin" && existingBootcamp.instructor.toString() !== userId) {
      return NextResponse.json({
        status: 403,
        message: "You don't have permission to update this bootcamp",
      });
    }

    // Prepare update data
    const updateData = {};

    // Basic fields
    const basicFields = [
      'title', 'short_description', 'description', 'thumbnail', 'overview_video',
      'category', 'subCategory', 'price', 'discount', 'duration_weeks', 
      'start_date', 'end_date', 'application_deadline', 'level', 'language',
      'max_students', 'bootcamp_type', 'bootcamp_badge'
    ];

    basicFields.forEach(field => {
      const value = formdata.get(field);
      if (value !== null && value !== undefined) {
        if (['price', 'discount', 'duration_weeks', 'max_students'].includes(field)) {
          updateData[field] = parseFloat(value) || parseInt(value) || 0;
        } else {
          updateData[field] = value;
        }
      }
    });

    // Boolean fields
    const booleanFields = ['certification'];
    booleanFields.forEach(field => {
      const value = formdata.get(field);
      if (value !== null) {
        updateData[field] = value === "true";
      }
    });

    // Array fields (JSON parsed)
    const arrayFields = [
      'requirements', 'outcomes', 'bootcamp_tags', 'prerequisites', 
      'tools_and_technologies', 'bootcamp_includes', 'co_instructors'
    ];

    arrayFields.forEach(field => {
      const value = formdata.get(field);
      if (value) {
        try {
          updateData[field] = JSON.parse(value);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
        }
      }
    });

    // Parse phases if provided
    if (formdata.get("phases")) {
      try {
        updateData.phases = JSON.parse(formdata.get("phases"));
      } catch (error) {
        console.error("Error parsing phases:", error);
      }
    }

    // Parse schedule if provided
    const daysPerWeek = formdata.get("days_per_week");
    const hoursPerDay = formdata.get("hours_per_day");
    const classTimes = formdata.get("class_times");

    if (daysPerWeek || hoursPerDay || classTimes) {
      updateData.schedule = {
        ...existingBootcamp.schedule,
        ...(daysPerWeek && { days_per_week: parseInt(daysPerWeek) }),
        ...(hoursPerDay && { hours_per_day: parseInt(hoursPerDay) }),
        ...(classTimes && { class_times: JSON.parse(classTimes) }),
      };
    }

    // Parse career support options
    const careerSupportFields = [
      'job_placement_assistance', 'resume_review', 
      'interview_preparation', 'portfolio_building'
    ];

    const careerSupportUpdates = {};
    careerSupportFields.forEach(field => {
      const value = formdata.get(field);
      if (value !== null) {
        careerSupportUpdates[field] = value === "true";
      }
    });

    if (Object.keys(careerSupportUpdates).length > 0) {
      updateData.career_support = {
        ...existingBootcamp.career_support,
        ...careerSupportUpdates,
      };
    }

    // Validate the update data
    const validationErrors = await validateFields(updateData);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        status: 400,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check for duplicate title (excluding current bootcamp)
    if (updateData.title && updateData.title !== existingBootcamp.title) {
      const duplicateBootcamp = await Bootcamp.findOne({ 
        title: updateData.title,
        _id: { $ne: bootcampId }
      });
      if (duplicateBootcamp) {
        return NextResponse.json({
          status: 409,
          message: "A bootcamp with this title already exists",
        });
      }
    }

    // Handle status updates
    const statusValue = formdata.get("status");
    if (statusValue !== null && statusValue !== undefined) {
      // Only allow admin to change status, or instructor can set to pending
      if (role === "admin" || statusValue === "pending") {
        updateData.status = statusValue;
      }
    } else if (role !== "admin") {
      // If instructor is updating other fields, set status to pending (requires admin approval)
      updateData.status = "pending";
    }

    // Update the bootcamp
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      bootcampId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate([
      { path: "instructor", select: "_id name image profession" },
      { path: "co_instructors", select: "_id name image profession" },
      { path: "category", select: "_id categoryName" },
    ]);

    return NextResponse.json({
      status: 200,
      message: "Bootcamp updated successfully",
      data: updatedBootcamp,
    });

  } catch (error) {
    console.error("Error updating bootcamp:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
