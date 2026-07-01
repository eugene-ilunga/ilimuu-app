import { NextResponse } from "next/server";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";
import { connectToDB } from "@/utils/database";

//get all withdraw getways

export  async function POST(req, res) {
  try {
    const formData = await req.formData();
    const status = formData.get("status") || null;

    await connectToDB();
    const query = status ? { status } : {};

    const withdrawGateways = await WithdrawGateway.find(query).sort({ createdAt: -1 });

    return NextResponse.json({status:200, withdrawGateways});
  } catch (error) {
    return NextResponse.error(error);
  }
}
