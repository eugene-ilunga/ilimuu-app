import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDB } from "@/utils/database";
import Transaction from "@/app/model/transactionModel";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const page = parseInt(formData.get("page")) || 1;
    const pagination = parseInt(formData.get("pagination")) || 10;

    // Get role from cookies
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value || "instructor"; // Default to 'instructor'

    // Connect to the database
    await connectToDB();

    // Apply filtering based on role
    const query = role === "admin" ? {} : { user: cookieStore.get("user_id")?.value };

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .limit(pagination)
      .skip((page - 1) * pagination)
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
