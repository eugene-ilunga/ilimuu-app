import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PayoutAccount from "@/app/model/payoutAccountModel";
//Delete payout account
export async function DELETE(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("account_id");
    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Payout account ID is required",
      });
    }
    // Connect to the database
    await connectToDB();
    // Delete the payout account
    await PayoutAccount.findByIdAndDelete(id);
    return NextResponse.json({
      status: 200,
      message: "Payout account deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Failed to delete payout account",
    });
  }
}
