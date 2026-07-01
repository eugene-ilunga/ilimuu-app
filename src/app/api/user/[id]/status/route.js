import { NextResponse } from "next/server";
import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";
import { handleApiError } from "@/utils/errorHandler";
import { setCookies } from "@/utils/cookies";

export async function PATCH(request, { params }) {
  try {
    const userId = params.id;
    const { status } = await request.json();

    // Validate status
    if (!["active", "inactive", "blocked"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await connectToDB();

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return handleApiError(error);
  }
}
