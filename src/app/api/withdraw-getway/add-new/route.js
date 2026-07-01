import { NextResponse } from "next/server";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const requiredFields = JSON.parse(formData.get("requiredFields"));

    // Validate the requiredFields format
    if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
      return NextResponse.json({
        status: 400,
        message: "Required fields must be a non-empty array",
      });
    }

    for (const field of requiredFields) {
      if (!field.fieldName || !field.fieldType) {
        return NextResponse.json({
          status: 400,
          message:
            "Each required field must include 'fieldName' and 'fieldType'",
        });
      }

      const validTypes = ["string", "number", "boolean", "date"];
      if (!validTypes.includes(field.fieldType)) {
        return NextResponse.json({
          status: 400,
          message: `Invalid field type '${field.fieldType}' for field '${field.fieldName}'. Allowed types: ${validTypes.join(
            ", "
          )}.`,
        });
      }
    }

    await connectToDB();

    // Check if the gateway name already exists
    const existingGateway = await WithdrawGateway.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingGateway) {
      return NextResponse.json({
        status: 400,
        message: "Withdraw Gateway already exists with this name",
      });
    }

    // Create a new WithdrawGateway
    const withdrawGateway = new WithdrawGateway({
      name: name,
      requiredFields: requiredFields,
    });

    await withdrawGateway.save();

    return NextResponse.json({
      status: 200,
      message: "Withdraw Gateway added successfully",
    });
  } catch (error) {
    console.error("Error creating Withdraw Gateway:", error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while creating the Withdraw Gateway",
    });
  }
}
