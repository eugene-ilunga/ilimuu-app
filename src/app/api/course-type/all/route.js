import { NextResponse } from "next/server";
import CourseType from "../../../model/courseTypeModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const page = formData.get("page") || 1;
    const pagination = formData.get("pagination") || 5;

    await connectToDB();
    const count = await CourseType.countDocuments();
    const courseType = await CourseType.find()
      .skip((page - 1) * pagination)
      .limit(pagination)
      .sort({ _id: -1 });

    return NextResponse.json({
        status: 200,
        message: "All Course Types",
        data: courseType, total: count });
  } catch (err) {
    return handleApiError(err);
  }
}
