

import { NextResponse } from "next/server";
import CourseType from "../../../model/courseTypeModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {


  try {
    const formData = await req.formData();
    await connectToDB();

    
    // Create new Type
    await CourseType.updateOne(
        {_id: formData.get("id")}, 
        {
      name: formData.get("name"),
    });

    return NextResponse.json(
      { status: 200, message: "Type update successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return handleApiError(err);
  }
}
