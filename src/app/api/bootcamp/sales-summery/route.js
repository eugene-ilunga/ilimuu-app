import { NextResponse } from "next/server";
import CheckoutBootcamp from "@/app/model/checkoutBootcampModel";
import Bootcamp from "@/app/model/bootcampModel";
import { connectToDB } from "../../../../utils/database";

export async function POST(req, res) {
  try {
    await connectToDB();

    // Parse the request body to get userId (if provided)
    const formData = await req.formData();
    const instructorId = formData.get("mentorid");
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
    if (instructorId) {
      // Get bootcamp IDs for the specified instructor
      const bootcamps = await Bootcamp.find({ instructor: instructorId }).select("_id");
      const bootcampIds = bootcamps.map((bootcamp) => bootcamp._id);
      // Add bootcamp filter to the checkout filter
      filter.bootcamp = { $in: bootcampIds };
    }


    // Fetch data for the current and last week
    const totalOrders = await CheckoutBootcamp.countDocuments(filter);

    const totalOrdersThisWeek = await CheckoutBootcamp.countDocuments({
      ...filter,
      createdAt: { $gte: startOfWeek },
    });
    const totalOrdersLastWeek = await CheckoutBootcamp.countDocuments({
      ...filter,
      createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
    });

    const totalSalesAmount = await CheckoutBootcamp.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: "$total_amount" } } },
    ]);

    const totalSalesAmountThisWeek = await CheckoutBootcamp.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, totalAmount: { $sum: "$total_amount" } } },
    ]);

    const totalSalesAmountLastWeek = await CheckoutBootcamp.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$total_amount" } } },
    ]);

    const totalSalesAmountThisMonth = await CheckoutBootcamp.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: "$total_amount" } } },
    ]);

    const totalSalesAmountLastMonth = await CheckoutBootcamp.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$total_amount" } } },
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
