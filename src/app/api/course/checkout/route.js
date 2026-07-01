const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import Cart from "@/app/model/cartModel";
import Course from "@/app/model/courseModel";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";
import { generateInvoiceId } from "@/utils/generateInvoiceID";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { initiatePayment } from "@/utils/bkashService";
import Settings from "@/app/model/settingModel";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const handleError = (message, status = 400) =>
  NextResponse.json({ message }, { status });

const calculateTotalAmount = (cartItems) =>
  cartItems.reduce(
    (total, item) => total + item.course.price * item.quantity,
    0
  );

const createCheckoutSession = async ({
  userId,
  cart,
  paymentMethod,
  totalAmount,
  invoiceId,
  billingAddress,
}) => {
  const courses = cart.items.map((item) => item.course);
  const setting = await Settings.findOne();

  const commissionPercentage = setting?.courseCommissionRate ?? 0;
  const commission = (commissionPercentage / 100) * totalAmount;
  const platformFee = setting?.platformServiceFee ?? 0; // Assuming platform fee is a fixed value
  const tax = setting?.taxRate ? ((setting.taxRate / 100) * totalAmount) : 0; // Assuming tax is a percentage of total amount
  const earning = totalAmount - commission - platformFee - tax;
  const payoutProcessingTime = setting?.payoutProcessingTime ?? 7;

  console.log("setting:", setting);
  console.log("Commission:", commission);
  console.log("Platform Fee:", platformFee);
  console.log("Tax:", tax);

  await CheckoutCourse.create({
    user: new ObjectId(String(userId)),
    course: courses,
    paymentMethod,
    paymentId: invoiceId,
    totalAmount,
    paymentStatus: "pending",
    invoiceId,
    amount: earning,
    commission: commission,
    holdingPeriod: payoutProcessingTime,
    platformFee: platformFee,
    tax: tax,
    billingAddress: billingAddress || null,
  });
};

const paymentGateways = {
  stripe: async ({ cart, userId, invoiceId, totalAmount, billingAddress }) => {
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.course.title,
          description: item.course.description,
          images: [item.course.thumbnail],
        },
        unit_amount: Math.round(item.course.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/stripe/success?session_id=${invoiceId}`,
      cancel_url: `${process.env.BASE_URL}/?canceled=true`,
    });

    await createCheckoutSession({
      userId,
      cart,
      paymentMethod: "Stripe",
      totalAmount,
      invoiceId,
      billingAddress,
    });

    return { message: "Stripe Payment GetWay", url: session.url };
  },

  sslcommerz: async ({ cart, userId, invoiceId, totalAmount, billingAddress }) => {
    const sslcommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "USD",
      tran_id: `TRX_${Date.now()}`,
      fail_url: `${process.env.BASE_URL}/api/sslcommerz/fail`,
      success_url: `${process.env.BASE_URL}/api/sslcommerz/success?session_id=${invoiceId}`,
      cancel_url: `${process.env.BASE_URL}/?canceled=true`,
      cus_name: "customerName",
      cus_email: "customerEmail",
      cus_phone: "customerPhone",
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(sslcommerzData).toString(),
      }
    );

    const data = await response.json();

    console.log("SSLCommerz response:", data);
    if (data.status !== "SUCCESS")
      throw new Error("Payment initialization failed");

    await createCheckoutSession({
      userId,
      cart,
      paymentMethod: "sslcommerz",
      totalAmount,
      invoiceId,
      billingAddress,
    });

    return { message: "SSLCommerz Payment GetWay", url: data.GatewayPageURL };
  },

  razorpay: async ({ userId, cart, invoiceId, totalAmount, billingAddress }) => {
    const options = {
      amount: totalAmount * 100, // in paise (multiply by 100 to convert to INR)
      currency: "INR",
      description: "Payment for your order",
      callback_url: `${process.env.BASE_URL}/api/razorpay/success?session_id=${invoiceId}`,
    };

    const paymentLink = await razorpay.paymentLink.create(options);

    await createCheckoutSession({
      userId,
      cart,
      paymentMethod: "Razorpay",
      totalAmount,
      invoiceId,
      billingAddress,
    });

    return { message: "Razorpay Payment GetWay", url: paymentLink.short_url };
  },

  bkash: async ({ userId, cart, invoiceId, totalAmount, billingAddress }) => {
    try {
      const paymentData = await initiatePayment(
        totalAmount,
        invoiceId,
        "success"
      );

      if (paymentData && paymentData.bkashURL) {
        await createCheckoutSession({
          userId,
          cart,
          paymentMethod: "Bkash",
          totalAmount,
          invoiceId,
          billingAddress,
        });
        return { message: "Bkash Payment GetWay", url: paymentData.bkashURL };
      } else {
        return NextResponse.json({ error: "Failed to initiate payment" });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      return NextResponse.json({
        error: "Server error",
        details: error.message,
      });
    }
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const cookiesStore = await cookies();
    const userId = formData.get("user_id") || cookiesStore.get("user_id")?.value;
    const paymentMethod = formData.get("paymentMethod").toLowerCase();
    console.log("Payment Method:", paymentMethod);

    if (!userId || !paymentMethod)
      return handleError("Missing required fields");

    await connectToDB();

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.course",
      select: "_id title price thumbnail",
      model: Course,
    });

    if (!cart) return handleError("Le panier est vide");

    const invoiceId = generateInvoiceId();
    const totalAmount = calculateTotalAmount(cart.items);
    
    // Extract billing address from formData
    const billingAddressData = formData.get("billingAddress");
    const billingAddress = billingAddressData ? JSON.parse(billingAddressData) : null;

    if (paymentGateways[paymentMethod]) {
      const result = await paymentGateways[paymentMethod]({
        cart,
        userId,
        invoiceId,
        totalAmount,
        billingAddress,
      });
      return NextResponse.json(result, { status: 200 });
    }

    return handleError("Invalid payment method");
  } catch (err) {
    console.error("Error processing payment:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
