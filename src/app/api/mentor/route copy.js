import { NextResponse } from "next/server";
import User from "../../model/userModel";
import { connectToDB } from "../../../utils/database";

export async function POST(req,res) {
  try {
   // const formData = await req.formData();
    await connectToDB();
    const mentors = await User.find({ role: "instructor" }).select("-password");
    // find all users and exclude password field
    return NextResponse.json({
      status: 200,
      message: "Top Mentors",
      data: mentors,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
