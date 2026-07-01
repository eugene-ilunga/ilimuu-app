import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export async function POST(req) {
  try {
    const { amount, currency = 'INR', name, email, contact } = await req.json();

    // Create Razorpay payment link
    const options = {
      amount: amount * 100, // amount in paise (multiply by 100 to convert to INR)
      currency,
      description: "Payment for your order",
      customer: {
        name,
        email,
        contact: contact || undefined, // Pass valid contact or omit if not provided
      },
      notify: {
        email: true, // Optional: enable email notification to customer
        sms: false,  // Optional: enable SMS notification to customer
      },
      callback_url: "https://yourdomain.com/payment-success", // Optional redirect URL after payment
      callback_method: "get", // Optional: HTTP method for callback
    };

    const paymentLink = await razorpay.paymentLink.create(options);

    // Return the payment link URL to the client
    return NextResponse.json({
      success: true,
      paymentUrl: paymentLink.short_url,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
