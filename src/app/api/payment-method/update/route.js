import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PaymentMethod from "@/app/model/paymentMethodModel";

export async function POST(request) {
  const formData = await request.formData();
  const paymentMethodId = formData.get("paymentMethodId");
  const name = formData.get("name");
  const description = formData.get("description");
  const image = formData.get("image");
  try {
    await connectToDB();
    const data = await PaymentMethod.findById(paymentMethodId);
    if (!data) {
      return NextResponse.json({
        status: 404,
        message: "Payment method not found",
      });
    }
    await PaymentMethod.findByIdAndUpdate(paymentMethodId, {
      name,
      description,
      image,
    });

    return NextResponse.json({
      status: 200,
      message: "Payment method updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
