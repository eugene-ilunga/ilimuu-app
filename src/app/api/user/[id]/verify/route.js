import { NextResponse } from "next/server";
import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";
import { handleApiError } from "@/utils/errorHandler";
import { setCookies } from "@/utils/cookies";

export async function PATCH(request, { params }) {
  try {
    const userId = params.id;
    const { isVerified } = await request.json();

    await connectToDB();

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return handleApiError(error);
  }
}
