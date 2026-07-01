import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import CheckoutCourse from "@/app/model/checkoutCourseModel";

export async function GET(req) {
  try {
    await connectToDB();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Calculate date 7 days ago

    // Today's date boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    // Aggregate checkouts grouped by day for the last 7 days
    const result = await CheckoutCourse.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }, // Filter for the last 7 days
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by day
          },
          amount: { $sum: "$totalAmount" }, // Sum up the total amount
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);

    // Calculate today's total amount separately
    const todayTotal = await CheckoutCourse.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd }, // Filter for today's range
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$totalAmount" }, // Sum up the total amount for today
        },
      },
    ]);

    // Extract today's total amount
    const todayAmount = todayTotal.length > 0 ? todayTotal[0].amount : 0;

    // Transform output to match desired structure
    const data = result.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));

    // Add today's total to the response
    const response = {
      last7Days: data,
      todayTotalAmount: todayAmount,
    };

    return NextResponse.json({
      status: 200,
      message: "Last week and today's checkout data",
      data: response,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
