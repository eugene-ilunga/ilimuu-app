import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import Course from "@/app/model/courseModel";

export async function POST(req) {
    const formData = await req.formData();
    const instructor_id = formData.get("instructorid");

    try {
        await connectToDB();

        // Fetch all courses by the instructor
        const instructorCourses = await Course.find({ instructor: instructor_id });

        // Get course IDs taught by the instructor
        const instructorCourseIds = instructorCourses.map(course => course._id);

        // Fetch all completed checkout records for those courses
        const checkoutCourses = await CheckoutCourse.find({
            course: { $in: instructorCourseIds },
            paymentStatus: "completed"
        });

        // Fetch all completed mentorship plan purchases for the instructor
        const checkoutPlans = await CheckoutPlan.find({
            mentor: instructor_id,
            paymentStatus: "completed"
        });

        // Calculate total earnings from courses
        const totalCourseEarnings = checkoutCourses.reduce((sum, item) => sum + item.totalAmount, 0);

        // Calculate total earnings from mentorship plans
        const totalPlanEarnings = checkoutPlans.reduce((sum, item) => sum + item.totalAmount, 0);

        // Total earnings (courses + plans)
        const totalEarnings = totalCourseEarnings + totalPlanEarnings;

        // Calculate ready-to-withdraw (completed payments older than 7 days)
        const readyToWithdrawCourses = checkoutCourses
            .filter(item => isReadyForWithdrawal(item.paymentDate))
            .reduce((sum, item) => sum + item.totalAmount, 0);

        const readyToWithdrawPlans = checkoutPlans
            .filter(item => isReadyForWithdrawal(item.paymentDate))
            .reduce((sum, item) => sum + item.totalAmount, 0);

        // Total ready-to-withdraw (courses + plans)
        const readyToWithdraw = readyToWithdrawCourses + readyToWithdrawPlans;

        // Placeholder for total withdrawals (you would fetch from your withdrawal model)
        const totalWithdrawals = 0; // Replace with actual logic if available

        return NextResponse.json({
            status: 200,
            data: {
                totalEarnings,
                readyToWithdraw,
                totalWithdrawals
            }
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { status: 400, message: err.message },
            { status: 400 }
        );
    }
}

// Helper function to check if the payment is older than 7 days
function isReadyForWithdrawal(paymentDate) {
    const now = new Date();
    const paymentTime = new Date(paymentDate);
    const diffTime = Math.abs(now - paymentTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7; // Payment older than 7 days
}
