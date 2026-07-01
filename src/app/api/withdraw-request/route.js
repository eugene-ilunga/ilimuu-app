import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import WithdrawRequest from "@/app/model/withdrawRequestModel";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
export async function POST(req) {
  const formData = await req.formData();
  const cookiesStore = await cookies();
  const userId = formData.get("mentorid") || cookiesStore.get("user_id")?.value;
  const pagination = formData.get("pagination") || 5;
  const page = formData.get("page") || 1;
  const transactionId = formData.get("transactionId") ;
  const status = formData.get("status");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    await connectToDB();
    
    console.log("userId", userId);
      // Build the query object dynamically
      const query = { user: new ObjectId(String(userId)) };

      if (transactionId) {
        query.transactionId = transactionId; // Add transactionId to query
      }
      if (status) {
        query.status = status; // Add status to query
      }
  
      console.log("query", query);
      const total = await WithdrawRequest.countDocuments(query);

      const withdrawRequest = await WithdrawRequest.find(query)
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
