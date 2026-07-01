import { NextResponse } from "next/server";
import User from "../../model/userModel";
import { connectToDB } from "../../../utils/database";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();

    const limit = formdata.get("pagination") || 5;
    const pageNumber = formdata.get("page") || 1;
    const searchQuery = formdata.get("search") || ""
    const profession = formdata.get("profession") || ""
    const role = formdata.get("role") || ""
    await connectToDB();

    const searchCondition = {
      ...(searchQuery && {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } }
        ]
      }),
      ...(profession && { profession: { $regex: profession, $options: "i" } }),
      ...(role && { role: { $regex: role, $options: "i" } })
    }

    console.log(searchCondition);
    const total = await User.countDocuments(searchCondition);

    const mentors = await User.find(searchCondition)
      .select("-password") // find all users and exclude password field
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    return NextResponse.json({
      status: 200,
      message: "User",
      data: mentors,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}



