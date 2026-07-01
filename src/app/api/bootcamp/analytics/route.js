import { NextResponse } from "next/server";
import Bootcamp from "../../../model/bootcampModel";
import EnrollBootcamp from "../../../model/enrollBootcampModel";
import CheckoutBootcamp from "../../../model/checkoutBootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Get bootcamp analytics
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const period = searchParams.get("period") || "30"; // days

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || (role !== "admin" && role !== "instructor")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized access",
      });
    }

    await connectToDB();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (parseInt(period) * 24 * 60 * 60 * 1000));

    let matchQuery = {};
    if (bootcampId) {
      matchQuery.bootcampId = new ObjectId(bootcampId);
    }

    // Get enrollment statistics
    const enrollmentStats = await EnrollBootcamp.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$enrollment_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get enrollment trends over time
    const enrollmentTrends = await EnrollBootcamp.aggregate([
      { 
        $match: { 
          ...matchQuery,
          application_date: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$application_date" },
            month: { $month: "$application_date" },
            day: { $dayOfMonth: "$application_date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Get payment statistics
    const paymentStats = await CheckoutBootcamp.aggregate([
      { 
        $match: { 
          ...matchQuery,
          payment_date: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: "$payment_status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$total_amount" },
        },
      },
    ]);

    // Get completion rates
    const completionStats = await EnrollBootcamp.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$enrollment_status", "completed"] }, 1, 0]
            }
          },
          averageProgress: { $avg: "$progress.overall_progress" },
        },
      },
    ]);

    // Get bootcamp performance
    const bootcampPerformance = await Bootcamp.aggregate([
      { $match: bootcampId ? { _id: new ObjectId(bootcampId) } : {} },
      {
        $lookup: {
          from: "enrollbootcamps",
          localField: "_id",
          foreignField: "bootcampId",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "checkoutbootcamps",
          localField: "_id",
          foreignField: "bootcamp",
          as: "payments",
        },
      },
      {
        $project: {
          title: 1,
          price: 1,
          max_students: 1,
          enrolled_students: 1,
          enrollmentCount: { $size: "$enrollments" },
          paymentCount: { $size: "$payments" },
          totalRevenue: { $sum: "$payments.total_amount" },
          completionRate: {
            $cond: [
              { $gt: [{ $size: "$enrollments" }, 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: "$enrollments",
                            cond: { $eq: ["$$this.enrollment_status", "completed"] }
                          }
                        }
                      },
                      { $size: "$enrollments" }
                    ]
                  },
                  100
                ]
              },
              0
            ]
          },
        },
      },
    ]);

    // Format the data
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
      completed: 0,
      dropped: 0,
    };

    enrollmentStats.forEach((stat) => {
      stats.total += stat.count;
      stats[stat._id] = stat.count;
    });

    const paymentStatsFormatted = {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      totalRevenue: 0,
    };

    paymentStats.forEach((stat) => {
      paymentStatsFormatted.total += stat.count;
      paymentStatsFormatted.totalRevenue += stat.totalAmount;
      paymentStatsFormatted[stat._id.toLowerCase()] = stat.count;
    });

    const completionData = completionStats[0] || {
      total: 0,
      completed: 0,
      averageProgress: 0,
    };

    return NextResponse.json({
      status: 200,
      message: "Analytics data fetched successfully",
      data: {
        enrollmentStats: stats,
        enrollmentTrends,
        paymentStats: paymentStatsFormatted,
        completionStats: {
          total: completionData.total,
          completed: completionData.completed,
          completionRate: completionData.total > 0 
            ? Math.round((completionData.completed / completionData.total) * 100) 
            : 0,
          averageProgress: Math.round(completionData.averageProgress || 0),
        },
        bootcampPerformance,
        period: {
          start: startDate,
          end: endDate,
          days: parseInt(period),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
