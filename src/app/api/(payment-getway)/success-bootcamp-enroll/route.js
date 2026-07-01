import { connectToDB } from "@/utils/database";
import CheckoutBootcamp from "@/app/model/checkoutBootcampModel";
import EnrollBootcamp from "@/app/model/enrollBootcampModel";
import Bootcamp from "@/app/model/bootcampModel";
import Notification from "@/app/model/notificationModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDB();

  const session_id = request.nextUrl.searchParams.get("session_id");
  
  console.log("Success API - Session ID:", session_id);
  console.log("Success API - URL:", request.url);
  
  try {
    // First, let's check if any checkout records exist
    const allCheckouts = await CheckoutBootcamp.find({}).limit(5);
    console.log("Success API - Recent checkouts:", allCheckouts.map(c => ({ 
      invoice_id: c.invoice_id, 
      payment_status: c.payment_status,
      bootcamp: c.bootcamp,
      user: c.user 
    })));

    // Find and update the checkout record
    const checkout = await CheckoutBootcamp.findOneAndUpdate(
      { invoice_id: session_id },
      { 
        payment_status: "completed", 
        payment_date: new Date(),
        enrollment_confirmed: true,
        application_fee_paid: true
      },
      { new: true }
    );

    console.log("Success API - Found checkout:", checkout ? "Oui" : "Non");
    if (checkout) {
      console.log("Success API - Checkout details:", {
        invoice_id: checkout.invoice_id,
        payment_status: checkout.payment_status,
        bootcamp: checkout.bootcamp,
        user: checkout.user
      });
    }

    if (!checkout) {
      console.error("Bootcamp checkout not found for session_id:", session_id);
      return NextResponse.json({ 
        error: "Checkout not found",
        session_id: session_id,
        available_checkouts: allCheckouts.map(c => c.invoice_id)
      });
    }

    console.log("Bootcamp checkout found:", checkout);

    // Check if enrollment already exists
    const existingEnrollment = await EnrollBootcamp.findOne({
      bootcampId: checkout.bootcamp,
      userId: checkout.user,
    });

    if (existingEnrollment) {
      // Update existing enrollment to confirmed status
      await EnrollBootcamp.findOneAndUpdate(
        { 
          bootcampId: checkout.bootcamp,
          userId: checkout.user 
        },
        { 
          enrollment_status: "accepted"
        },
        { new: true }
      );
      
      console.log("Updated existing enrollment to accepted status");
    } else {
      // Create new enrollment record
      const bootcamp = await Bootcamp.findById(checkout.bootcamp);
      
      if (!bootcamp) {
        console.error("Bootcamp not found:", checkout.bootcamp);
        return NextResponse.json({ error: "Bootcamp not found" });
      }

      // Initialize phases progress based on bootcamp phases
      const phasesProgress = bootcamp.phases?.map(phase => ({
        phase_number: phase.phase_number,
        completion_percentage: 0,
        projects_completed: [],
      })) || [];

      console.log("Creating enrollment with data:", {
        bootcampId: checkout.bootcamp,
        userId: checkout.user,
        enrollment_status: "accepted",
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
        application_data: {
          motivation_letter: "Payment completed - enrollment confirmed",
          experience_level: "beginner",
          goals: "Complete bootcamp successfully",
          availability: "Full-time commitment",
        },
      });

      const enrollmentRecord = await EnrollBootcamp.create({
        bootcampId: checkout.bootcamp,
        userId: checkout.user,
        enrollment_status: "accepted",
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
        application_data: {
          motivation_letter: "Payment completed - enrollment confirmed",
          experience_level: "beginner", // Default, can be updated later
          goals: "Complete bootcamp successfully",
          availability: "Full-time commitment",
        },
      });

      console.log("Created new enrollment record");
    }

    // Update bootcamp enrolled students count
    await Bootcamp.findByIdAndUpdate(
      checkout.bootcamp,
      { 
        $addToSet: { enrolled_students: checkout.user }
      }
    );

    // Send notification to the user about successful enrollment
    await Notification.create({
      user: checkout.user,
      title: "Bootcamp Enrollment Successful",
      message: "Congratulations! Your bootcamp enrollment has been confirmed and payment processed successfully.",
      type: "BootcampEnrollment",
    });

    // Send notification to instructor/admin about new enrollment
    const bootcamp = await Bootcamp.findById(checkout.bootcamp).populate('instructor');
    if (bootcamp?.instructor) {
      await Notification.create({
        user: bootcamp.instructor._id,
        title: "New Bootcamp Enrollment",
        message: `A new student has enrolled in your bootcamp: ${bootcamp.title}`,
        type: "BootcampEnrollment",
      });
    }

    console.log("Bootcamp enrollment process completed successfully");

    // Redirect to bootcamp dashboard or success page
    return NextResponse.redirect(`${process.env.BASE_URL}/bootcamp/${checkout.bootcamp}/dashboard?enrollment=success`);
    
  } catch (error) {
    console.error("Error processing bootcamp payment success:", error);
    return NextResponse.json({ 
      error: error.message,
      message: "Failed to process payment success"
    });
  }
}
