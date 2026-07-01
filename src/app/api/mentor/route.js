import { NextResponse } from "next/server";
import User from "../../model/userModel";
import { connectToDB } from "../../../utils/database";

export async function POST(req, res) {
  try {
    // const formData = await req.formData();
    await connectToDB();

    const formData = await req.formData();


    const searchQuery = formData.get("search") || "";
    const page = parseInt(formData.get("page")) || 1;
    const limit = parseInt(formData.get("pagination")) || 6;

    const query = {
      role: "instructor",

    };
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    const mentors = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);



    // const mentors = await User.find({ role: "instructor" }).select("-password");
    // find all users and exclude password field
    return NextResponse.json({
      status: 200,
      message: "Top Mentors",
      data: mentors,
      total
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
