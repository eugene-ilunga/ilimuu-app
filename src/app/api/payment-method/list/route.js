import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PaymentMethod from "@/app/model/paymentMethodModel";

export async function GET(request) {
  try {
    await connectToDB();
    const paymentMethods = await PaymentMethod.find();
    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: error.message });
  }
}
