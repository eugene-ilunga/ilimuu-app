import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Transaction from "@/app/model/transactionModel";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId");
    const page = formData.get("page") || 1;
    const pagination = formData.get("pagination") || 10;

    if (!userId) {
      return NextResponse.json({
        status: 400,
        message: "User ID is required.",
      });
    }

    // Connect to the database
    await connectToDB();

    // Find transactions for the user with pagination
    const total = await Transaction.countDocuments({ user: userId });
    const transactions = await Transaction.find({ user: userId })
      .limit(parseInt(pagination))
      .skip((parseInt(page) - 1) * parseInt(pagination))
      .sort({ createdAt: -1 });

    return NextResponse.json({
      status: 200,
      message: "Transactions fetched successfully.",
      data: transactions,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

export async function GET(req) {
  try {
    await connectToDB();

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's total
    const todayTotal = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfToday },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // This month's total
    const monthTotal = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfMonth },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // All-time total
    const allTimeTotal = await Transaction.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return NextResponse.json({
      status: 200,
      message: "Transaction summary fetched successfully",
      today: todayTotal[0]?.total || 0,
      thisMonth: monthTotal[0]?.total || 0,
      all: allTimeTotal[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transaction summary" },
      { status: 500 }
    );
  }
}
