import User from "@/app/model/userModel";
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req) {
  const formData = await req.formData();
  const email = formData.get("email");

  console.log("Email:", email);
  try {
    await connectToDB(); // Ensure the database connection

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found" });
    }

    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry time to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log("OTP Code:", otpCode);

    // Update user with new OTP and expiration time
    await User.findOneAndUpdate(
      { email },
      { otp: { code: otpCode, expiresAt } },
      { new: true }
    );

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: `${process.env.APPNAME} <onboarding@sbayshop.com>`,
      to: [email],
      subject: "Your OTP Code",
      react: EmailTemplate({ otpCode }), // Pass the OTP to the email template
    });

    console.log("Sending OTP to", email);
    console.log("OTP:", otpCode);
    console.log("Email Error:", error);

    return NextResponse.json({
      status: 200,
      message: "OTP sent successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
