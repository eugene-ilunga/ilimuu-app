// app/api/payout-accounts/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PayoutAccount from "@/app/model/payoutAccountModel";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";


export async function POST(req) {
  try {
    const data = await req.json();

    console.log("Update Payout account data:", data);

    const { id, accountType, accountDetails } = data;

    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Payout account ID is required",
      });
    }

    // Connect to the database
    await connectToDB();

    // Fetch payment gateway validation rules from the database
    const gateway = await WithdrawGateway.findOne({ name: accountType });
    if (!gateway) {
      return NextResponse.json({
        status: 400,
        message: `Unsupported payment gateway: ${accountType}`,
      });
    }

    // Validate required fields for the gateway
    const missingFields = gateway.requiredFields.filter(({ fieldName }) => {
      const trimmedFieldName = fieldName.trim(); // Normalize field name by trimming whitespace
      const fieldValue = accountDetails.details[trimmedFieldName]; // Match normalized field name
      
      // Check if the field is missing or, if it's a string, empty after trimming
      return (
        fieldValue === undefined || 
        (typeof fieldValue === "string" && fieldValue.trim() === "")
      );
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing or empty required fields for ${accountType}: ${missingFields
          .map(({ fieldName }) => fieldName.trim())
          .join(", ")}`,
      });
    }

    // Update the payout account
    const updatedAccount = await PayoutAccount.findByIdAndUpdate(
      id,
      {
        accountType,
        accountDetails,
      },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedAccount) {
      return NextResponse.json({
        status: 404,
        message: "Payout account not found",
      });
    }

    console.log("Payout account updated:", updatedAccount);

    // Send a success response
    return NextResponse.json({
      status: 200,
      message: "Payout account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    // Log and return an error response
    console.error("Error occurred:", error);
    return NextResponse.json({ status: 400, error: error.message });
  }
}
