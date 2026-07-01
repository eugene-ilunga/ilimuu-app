import bcrypt from "bcryptjs";
import User from "@/app/model/userModel";
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get("email");
    const newPassword = formData.get("newPassword");

    if (!email || !newPassword) {
      return NextResponse.json({
        status: 500,
        message: "Email and new password are required.",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      status: 200,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error.",
    });
  }
}

export async function PUT(req, res) {
  const formData = await req.formData();
  const userid = formData.get("userid");
  const oldPassword = formData.get("oldPassword");
  const newPassword = formData.get("newPassword");

  if (!oldPassword || !newPassword) {
    return NextResponse.json({
      status: 500,
      message: "Old password and new password are required.",
    });
  }

  try {
    await connectToDB();

    // Check if user exists
    const user = await User.findOne({ _id: userid });
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found." });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({
        status: 401,
        message: "Invalid old password.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      status: 200,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error.",
    });
  }
}
