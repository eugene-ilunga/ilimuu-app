import { NextResponse } from "next/server";
import { Resend } from "resend";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req) {
  try {
    const { email, subject, templateFunction, templateData } = await req.json();

    // Validate required fields
    if (!email || !subject || !templateFunction) {
      return NextResponse.json({
        status: 400,
        message: "Email, subject, and template function are required.",
      });
    }

    // Dynamically generate email template content
    const emailContent = templateFunction(templateData);

    // Send email using Resend
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: `${process.env.APPNAME} <no-reply@yourdomain.com>`,
      to: [email],
      subject,
      react: emailContent,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({
        status: 500,
        message: "Failed to send email.",
        error,
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Email sent successfully.",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred.",
    });
  }
}
