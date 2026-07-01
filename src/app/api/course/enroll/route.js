import { NextResponse } from "next/server";
import Enroll from "../../../model/enrollModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";
import { ObjectId } from "mongodb";
const requiredFields = [
  "courseid",
  "userid",
  "instructorid",
  "total",
  "discount",
  "paymentId",
  "status"
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
      const enrollData = {
        course: new ObjectId(String(data.get("courseid"))),
        user: new ObjectId(String(data.get("userid"))),
        instructor: new ObjectId(String(data.get("instructorid"))),
        total: data.get("total"),
        discount: data.get("discount"),
        paymentId: data.get("paymentId"),
        status: data.get("status"),
      };

  
      await connectToDB();
  

    await Enroll.create(enrollData);

    return NextResponse.json(
      { status: 201, message: "Enrolled successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
