import { NextResponse } from "next/server";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";
import { connectToDB } from "@/utils/database";

// delete withdraw getway

export async function DELETE(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");

    await connectToDB();

    const existingGateway = await WithdrawGateway.findById(id);

    if (!existingGateway) {
      return NextResponse.json({
        status: 404,
        message: "Withdraw Gateway not found",
      });
    }

    await WithdrawGateway.findByIdAndDelete(id);

    return NextResponse.json({
      status: 200,
      message: "Gateway deleted successfully",
    });
  } catch (error) {
    return NextResponse.error(error);
  }
}
