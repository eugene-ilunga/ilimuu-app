import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import PaymentMethod from "@/app/model/paymentMethodModel";
import { stat } from "fs";

export async function POST(request, response) {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
const imageValue = formData.get("image");
  const codeName = formData.get("codeName");
const image = imageValue && imageValue.name ? imageValue : null;

  try {
    await connectToDB();

    const paymentMethod = await PaymentMethod.findOne({name:name });

    if (paymentMethod) {
      return NextResponse.json({
        status: 400,
        message: "Payment method already exists",
      });
    }

    await PaymentMethod.create({
      name,
      description,
      image,
      codeName,
    });

    return NextResponse.json({
      status: 201,
      message: "Payment method added successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
