import { NextResponse } from "next/server";
import CourseType from "../../../model/courseTypeModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {


  try {
    const formData = await req.formData();
    await connectToDB();

    // Check if type already exists
    const existingType= await CourseType.findOne({
      name: formData.get("name"),
    });
    if (existingType) {
      return NextResponse.json(
        { status: 409, message: "Course Type already exists" },
        { status: 409 }
      );
    }
 
    // Create new Type
    await CourseType.create({
      name: formData.get("name"),
    });

    return NextResponse.json(
      { status: 201, message: "Type created successfully" },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
