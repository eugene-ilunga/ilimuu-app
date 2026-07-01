import { NextResponse } from "next/server";
import Course from "../../../model/courseModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";
import { ObjectId } from "mongodb";
import CourseType from "@/app/model/courseTypeModel";
import { cookies } from "next/headers";
const requiredFields = [
  "title",
  "description",
  "short_description",
  "price",
  "thumbnail",
  "category",
  "overview_video"
];

async function validateFields(data) {
  for (const field of requiredFields) {
    if (!data.get(field)) {
      return field;
    }
  }
  return null;
}

export async function POST(req, res) {
  try {
    const data = await req.formData();


    const missingField = await validateFields(data);
    if (missingField) {
      return NextResponse.json(
        { status: 400, message: `The field ${missingField} is required` },
        { status: 400 }
      );
    }

 
    const seoTag = {
        seoMetadata: String(data.get("seoMetadata") || ""),
        seoDescription: String(data.get("seoDescription") || ""),
      };

      const cookiesStore = await cookies();


      const user_id = cookiesStore.get("user_id")?.value;


      const courseData = {
        title: data.get("title"),
        description: data.get("description"),
        short_description: data.get("short_description"),
        thumbnail: data.get("thumbnail"),
        overview_video: data.get("overview_video"),
        category:  new ObjectId(String(data.get("category"))),
        subCategory: data.get("subCategory"),
        price: data.get("price"),
        discount: data.get("discount"),
        duration: data.get("duration"),
        level: data.get("level"),
        language: data.get("language"),
        totalSeat: data.get("totalSeat"),
        requirements: data.getAll("requirements"),
        outcomes: data.getAll("outcomes"),
        courseTags:data.getAll("courseTags"),
        courseIncludes: data.getAll("courseIncludes"),
        course_type: new ObjectId(String(data.get("course_type"))),
 
        expiringMonth: data.get("expiringMonth"),
        seoTags: seoTag,
        cetification: data.get("cetification"),
        instructor: new ObjectId(String(user_id)),
        session_type: data.get("session_type")
      
      };


      console.log(courseData);
  
      await connectToDB();
  

    await Course.create(courseData);

    return NextResponse.json(
      { status: 201, message: "Course added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
