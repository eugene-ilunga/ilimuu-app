import { NextResponse } from "next/server";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    await connectToDB();

    // Parse the request body to get userId (if provided)
    const formData = await req.formData();
    const mentorid = formData.get("mentorid");
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

  
    // Build the filter object
    const filter = mentorid ? { mentor: new ObjectId(String(mentorid)) } : {};

    console.log("Filter:", filter);

    // Fetch data for the current and last week
    const totalOrders = await CheckoutPlan.countDocuments(filter);

    const totalOrdersThisWeek = await CheckoutPlan.countDocuments({
      ...filter,
      createdAt: { $gte: startOfWeek },
    });
    const totalOrdersLastWeek = await CheckoutPlan.countDocuments({
      ...filter,
      createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
    });

    console.log("Total orders:", totalOrders);
    console.log("Total orders this week:", totalOrdersThisWeek);
    console.log("Total orders last week:", totalOrdersLastWeek);

    const totalSalesAmount = await CheckoutPlan.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountThisWeek = await CheckoutPlan.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    console.log(
      "Total sales amount:",
      totalSalesAmountThisWeek[0]?.totalAmount
    );

    const totalSalesAmountLastWeek = await CheckoutPlan.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    // Fetch data for the current and last month
    const totalSalesAmountThisMonth = await CheckoutPlan.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmountLastMonth = await CheckoutPlan.aggregate([
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
