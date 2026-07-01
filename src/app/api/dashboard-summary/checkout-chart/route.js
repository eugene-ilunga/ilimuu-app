import CheckoutCourse from "@/app/model/checkoutCourseModel"
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

export  async function GET(req, res) {

  try {
    await connectToDB();

    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

    // Aggregation for courses
    const courseData = await CheckoutCourse.aggregate([
      { $match: { paymentDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Aggregation for mentorship plans
    const planData = await CheckoutPlan.aggregate([
      { $match: { paymentDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Prepare response
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const chartDataBar = Array.from({ length: 6 }).map((_, i) => {
      const monthIndex = (new Date().getMonth() - 5 + i + 12) % 12;
      const courseCount = courseData.find(item => item._id === monthIndex + 1)?.count || 0;
      const planCount = planData.find(item => item._id === monthIndex + 1)?.count || 0;

      return {
        month: months[monthIndex],
        courses: courseCount,
        plans: planCount,
      };
    });

   return NextResponse.json({status:200,
    message:"last 6 months checkout chart data",
    
    chartDataBar});
  } catch (error) {
    console.error(error);
   return NextResponse.json({ error: "Internal Server Error" });
  }
}
