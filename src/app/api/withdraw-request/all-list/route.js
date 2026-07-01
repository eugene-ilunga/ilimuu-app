import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import WithdrawRequest from "@/app/model/withdrawRequestModel";
import { cookies } from "next/headers";
import User from "@/app/model/userModel";
export async function POST(req) {
  const formData = await req.formData();
  const pagination = formData.get("pagination") || 5;
  const page = formData.get("page") || 1;
  const transactionId = formData.get("transactionId");
  const status = formData.get("status");
  try {
    await connectToDB();

    // Build the query object dynamically
    const query = {};

    if (transactionId) {
      query.transactionId = { $regex: transactionId, $options: "i" }; // Case-insensitive match
    }
    if (status) {
      query.status = status; // Add status to query
    }

    console.log("Query data:", query);

    const total = await WithdrawRequest.countDocuments(query);

    const withdrawRequest = await WithdrawRequest.find(query)
      .populate({
        path: "user",
        select: "_id name",
        model: User,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pagination)
      .limit(pagination);

    return NextResponse.json({
      status: 200,
      message: "Withdraw Request List",
      withdrawRequest,
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
