import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  // Connect to the database

  const formData = await req.formData();

  const email = formData.get("email");
  const otp = formData.get("otp");

  if (!email || !otp) {
    return NextResponse.json({
      status: 500,
      message: "Email and OTP are required.",
    });
  }

  try {
    await connectToDB(); // Ensure the database connection

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found." });
    }

    // Check if OTP exists and is valid
    if (
      !user.otp ||
      user.otp.code !== otp ||
      new Date() > new Date(user.otp.expiresAt)
    ) {
      return NextResponse.json({
        status: 400,
        message: "Invalid or expired OTP.",
      });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    return NextResponse.json({
      status: 200,
      message: "User verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json({
      status: 200,
      message: "Internal server error.",
    });
  }
}
