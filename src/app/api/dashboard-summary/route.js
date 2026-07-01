import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import Course from "@/app/model/courseModel";
import Earnings from "@/app/model/earningModel";
import { cookies } from "next/headers";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        // Retrieve user ID from cookies
        const userId = cookieStore.get("user_id")?.value;

        if (!userId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        await connectToDB();

        // Fetch total users and courses
        const totalUser = await User.countDocuments();
        const totalCourse = await Course.countDocuments();

        // Calculate total earnings
        const totalEarnings = await Earnings.aggregate([
            { $group: { _id: null, totalEarnings: { $sum: "$totalEarnings" } } },
        ]);

        // Calculate profit for the specific user
        const totalProfit = await Earnings.aggregate([
            { $match: { user: userId } }, // Filter by userId
            { $group: { _id: null, totalEarnings: { $sum: "$totalEarnings" } } },
        ]);

        // Fetch completed course and plan checkouts
const totalCourseSales = await CheckoutCourse.aggregate([
  { $match: { paymentStatus: "completed" } },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" }, // total revenue from customer
      totalEarning: { $sum: "$amount" }, // after commission (mentor earnings)
    }
  }
]);

const totalPlanCheckouts = await CheckoutPlan.aggregate([
  { $match: { paymentStatus: "completed" } },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
      totalEarning: { $sum: "$amount" }
    }
  }
]);


        const totalSales = totalCourseSales[0]?.totalRevenue + totalPlanCheckouts[0]?.totalRevenue;
        const commission = totalCourseSales[0]?.totalEarning + totalPlanCheckouts[0]?.totalEarning;



        return NextResponse.json({
            totalUser,
            totalCourse,
            totalEarnings: totalEarnings[0]?.totalEarnings || 0,
            totalProfit: totalProfit[0]?.totalEarnings || 0,
            totalSales,
            commission,
        });
    } catch (error) {
        console.error("Error fetching dashboard summary data:", error);
        return NextResponse.json({ error: "Error fetching dashboard summary data" }, { status: 500 });
    }
}
