import { NextResponse } from "next/server";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");  // MongoDB ObjectId
    const name = formData.get("name");
    const requiredFields = JSON.parse(formData.get("requiredFields"));

    console.log("id", id);
    console.log("name", name);
    console.log("requiredFields", requiredFields);

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

    // Find the existing Withdraw Gateway by ID
    const existingGateway = await WithdrawGateway.findById(id);

    console.log("existingGateway", existingGateway);

    if (!existingGateway) {
      return NextResponse.json({
        status: 404,
        message: "Withdraw Gateway not found",
      });
    }

    // Update the existing gateway with the new data
    existingGateway.requiredFields = requiredFields;
    existingGateway.name = name;

    // Save the updated gateway
    await existingGateway.save();

    return NextResponse.json({
      status: 200,
      message: "Withdraw Gateway updated successfully",
    });
  } catch (error) {
    console.error("Error updating Withdraw Gateway:", error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while updating the Withdraw Gateway",
    });
  }
}
