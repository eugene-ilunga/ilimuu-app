

import AdmissionMessage from "@/app/model/admissionMessageModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      await connectToDB();
      const contacts = await AdmissionMessage.find().sort({ createdAt: -1 }); // Sort by newest first
      return NextResponse.json({ success: true, contacts }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
