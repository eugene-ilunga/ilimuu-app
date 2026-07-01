// app/api/payout-accounts/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PayoutAccount from "@/app/model/payoutAccountModel";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";

import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const data = await req.json();

    console.log("Payout account data:", data);
    const cookiesStore = await cookies();

    if (data.user === undefined) {
      data.user = cookiesStore.get("user_id")?.value;
    }

    // Connect to the database
    await connectToDB();

    const { accountType, accountDetails } = data;

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
      throw new Error(
        `Missing or empty required fields for ${accountType}: ${missingFields
          .map(({ fieldName }) => fieldName.trim())
          .join(", ")}`
      );
    }

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields for ${accountType}: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Validate and save the payout account
    const payoutAccount = await PayoutAccount.create(data);
    console.log("Payout account saved:", payoutAccount);

    // Send a success response
    return NextResponse.json({
      status: 201,
      message: "Payout account added successfully",
    });
  } catch (error) {
    // Log and return an error response
    console.error("Error occurred:", error);
    return NextResponse.json({ status: 400, error: error.message });
  }
}
