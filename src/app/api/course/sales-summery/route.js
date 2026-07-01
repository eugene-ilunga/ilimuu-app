import { NextResponse } from "next/server";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import Course from "@/app/model/courseModel";
import { connectToDB } from "../../../../utils/database";

export async function POST(req, res) {
  try {
    await connectToDB();

    // Parse the request body to get userId (if provided)
    const formData = await req.formData();
    const mentorId = formData.get("mentorid");
    // Helper function to strip time from a Date object and return a new Date object
    const getDateOnly = (date) => {
      const newDate = new Date(date);
      newDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC to ensure consistency
      return newDate;
    };
    // Get the current date and the start of this week/month
    const currentDate = new Date();
    const startOfWeek = getDateOnly(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      )
    );
    const startOfMonth = getDateOnly(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );

    // Get the start of the previous week/month
    const startOfLastWeek = getDateOnly(
      new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() - 7
      )
    );
    const startOfLastMonth = getDateOnly(
      new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1)
    );
    // Build the query filter
    const filter = {};
    if (mentorId) {
      // Get course IDs for the specified mentor
      const courses = await Course.find({ instructor: mentorId }).select("_id");
      const courseIds = courses.map((course) => course._id);
      // Add course filter to the checkout filter
      filter.course = { $in: courseIds };
    }


    // Fetch data for the current and last week
    const totalOrders = await CheckoutCourse.countDocuments(filter);

    const totalOrdersThisWeek = await CheckoutCourse.countDocuments({
      ...filter,
      createdAt: { $gte: startOfWeek },
    });
    const totalOrdersLastWeek = await CheckoutCourse.countDocuments({
      ...filter,
      createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
    });

    const totalSalesAmount = await CheckoutCourse.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountThisWeek = await CheckoutCourse.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountLastWeek = await CheckoutCourse.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountThisMonth = await CheckoutCourse.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountLastMonth = await CheckoutCourse.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    // Calculate percentage changes
    const totalOrderPercentageChange =
      ((totalOrdersThisWeek - totalOrdersLastWeek) /
        (totalOrdersLastWeek || 1)) *
      100;
    const totalSalesPercentageChange =
      (((totalSalesAmountThisWeek[0]?.totalAmount || 0) -
        (totalSalesAmountLastWeek[0]?.totalAmount || 0)) /
        (totalSalesAmountLastWeek[0]?.totalAmount || 1)) *
      100;
    const monthlySalesPercentageChange =
      (((totalSalesAmountThisMonth[0]?.totalAmount || 0) -
        (totalSalesAmountLastMonth[0]?.totalAmount || 0)) /
        (totalSalesAmountLastMonth[0]?.totalAmount || 1)) *
      100;

    return NextResponse.json({
      status: 200,
      data: {
        totalOrders: totalOrders,
        totalOrderLastweekPercentageChange:
          +totalOrderPercentageChange.toFixed(0),
        totalSalesAmount: totalSalesAmount[0]?.totalAmount || 0,
        totalSalesPercentageChange: +totalSalesPercentageChange.toFixed(1),

        totalSalesAmountThisWeek: totalSalesAmountThisWeek[0]?.totalAmount || 0,
        totalSalesPercentageChangeThisWeek:
          +totalSalesPercentageChange.toFixed(1),

        totalSalesAmountThisMonth:
          totalSalesAmountThisMonth[0]?.totalAmount || 0,
        monthlySalesPercentageChange: +monthlySalesPercentageChange.toFixed(1),
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
