import { NextResponse } from "next/server";
import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";
import { handleApiError } from "@/utils/errorHandler";
import { setCookies } from "@/utils/cookies";

const requiredFields = ["name", "email"];

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

    await connectToDB();

    const userExists = await User.findOne({ email: data.get("email") });

    if (userExists && userExists._id.toString() !== data.get("userid")) {
      return NextResponse.json(
        {
          status: 409,
          message: "Provided Email already used for antoher account",
        },
        { status: 409 }
      );
    }

    const updateUser = await User.findByIdAndUpdate(
      data.get("userid"),
      {
        name: data.get("name"),
        email: data.get("email"),
        image: data.get("image"),
        phone: data.get("phone"),
        gender: data.get("gender"),
      },
      { new: false, runValidators: true }
    ); // new: true returns the updated document

    if (updateUser) {
      setCookies(data.get("name"), data.get("email"), data.get("image"));
    }

    return NextResponse.json({
      status: 200,
      message: "User Updated Successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}



