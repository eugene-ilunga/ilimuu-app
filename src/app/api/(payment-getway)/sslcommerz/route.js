import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { totalAmount, customerName, customerEmail, customerPhone } =
      await req.json();


    const sslcommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "USD",
      tran_id: `TRX_${Date.now()}`,
      success_url: "http://localhost:3000/api/sslcommerz/success",
      fail_url: "http://localhost:3000/api/sslcommerz/fail",
      cancel_url: "http://localhost:3000/api/sslcommerz/cancel",
      cus_name: customerName,
      cus_email: customerEmail,
      cus_phone: customerPhone,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: "Your Product",
      product_category: "E-commerce",
      product_profile: "general",
    };

    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(sslcommerzData).toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "SUCCESS") {
      return NextResponse.json({ url: data.GatewayPageURL });
    } else {
      return NextResponse.json(
        { message: "Payment initialization failed", error: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
