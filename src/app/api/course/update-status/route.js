import { NextResponse } from "next/server";
import Course from "../../../model/courseModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {


  try {
    const formData = await req.formData();
    await connectToDB();

    // Update category
    const updatedCategory = await Course.updateOne(
        { _id: formData.get("id") }, // Filter to find the category by ID
        {
          status: formData.get("status"),
        }
      );

          // Check if the category was updated
    if (updatedCategory.nModified === 0) {
        return NextResponse.json(
          { status: 404, message: "Course not found or no changes made" },
          { status: 404 }
        );
      }

      
    return NextResponse.json(
      { status: 200, message: "Course update successfully" },
      { status: 200 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
