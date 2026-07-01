const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";
import MentorshipPlan from "@/app/model/mentorshipPlanModel";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";
import { generateInvoiceId } from "@/utils/generateInvoiceID";
import Razorpay from "razorpay";
import { initiatePayment } from "@/utils/bkashService";
import { cookies } from "next/headers";
import Settings from "@/app/model/settingModel";
import { console } from "inspector";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const handleError = (message, status = 400) =>
  NextResponse.json({ message }, { status });

const createCheckoutSession = async ({
  userId,
  mentorId,
  planId,
  packageId,
  paymentMethod,
  totalAmount,
  invoiceId,
  paymentId,
}) => {
  const setting = await Settings.findOne();

  const commissionPercentage = setting?.mentorshipCommissionRate ?? 0;
  const commission = (commissionPercentage / 100) * totalAmount;
  const platformFee = setting?.platformServiceFee ?? 0; // Assuming platform fee is a fixed value
  const tax = setting?.taxRate ? (setting.taxRate / 100) * totalAmount : 0; // Assuming tax is a percentage of total amount

  const earning = totalAmount - commission - platformFee - tax;
  const payoutProcessingTime = setting?.payoutProcessingTime ?? 7;

  await CheckoutPlan.create({
    user: new ObjectId(String(userId)),
    mentor: new ObjectId(String(mentorId)),
    plan: new ObjectId(String(planId)),
    package: new ObjectId(String(packageId)),
    paymentMethod,
    paymentId,
    totalAmount,
    paymentStatus: "pending",
    invoiceId,
    amount: earning,
    commission: commission,
    holdingPeriod: payoutProcessingTime,
    platformFee: platformFee,
    tax: tax,
  });
};

const paymentGateways = {
  stripe: async ({ item, userId, mentorId, planId, packageId, invoiceId }) => {
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.short_description,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/success-payment-plan?session_id=${invoiceId}`,
      cancel_url: `${process.env.BASE_URL}/?canceled=true`,
    });

    await createCheckoutSession({
      userId,
      mentorId,
      planId,
      packageId,
      paymentMethod: "Stripe",
      totalAmount: item.price,
      invoiceId,
      paymentId: session.id,
    });

    return { message: "Stripe Payment Gateway", url: session.url };
  },

  sslcommerz: async ({
    item,
    userId,
    mentorId,
    planId,
    packageId,
    invoiceId,
  }) => {
    const totalAmount = item.price;
    const sslcommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "USD",
      tran_id: `TRX_${Date.now()}`,
      fail_url: `${process.env.BASE_URL}/api/sslcommerz/fail`,
      success_url: `${process.env.BASE_URL}/api/success-payment-plan?session_id=${invoiceId}`,
      cancel_url: `${process.env.BASE_URL}/?canceled=true`,
      cus_name: "Customer",
      cus_email: "customer@example.com",
      cus_phone: "123456789",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
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
    if (data.status !== "SUCCESS")
      throw new Error("SSLCommerz payment initialization failed");

    await createCheckoutSession({
      userId,
      mentorId,
      planId,
      packageId,
      paymentMethod: "SSLCommerz",
      totalAmount,
      invoiceId,
      paymentId: data.tran_id,
    });

    return { message: "SSLCommerz Payment Gateway", url: data.GatewayPageURL };
  },

  razorpay: async ({
    item,
    userId,
    mentorId,
    planId,
    packageId,
    invoiceId,
  }) => {
    const options = {
      amount: item.price * 100, // in paise (multiply by 100 to convert to INR)
      currency: "INR",
      description: "Payment for your mentorship plan",
      callback_url: `${process.env.BASE_URL}/api/success-payment-plan?session_id=${invoiceId}`,
    };

    const paymentLink = await razorpay.paymentLink.create(options);

    await createCheckoutSession({
      userId,
      mentorId,
      planId,
      packageId,
      paymentMethod: "Razorpay",
      totalAmount: item.price,
      invoiceId,
      paymentId: paymentLink.id,
    });

    return { message: "Razorpay Payment Gateway", url: paymentLink.short_url };
  },

  bkash: async ({ item, userId, mentorId, planId, packageId, invoiceId }) => {
    const totalAmount = item.price;

    try {
      const paymentData = await initiatePayment(
        totalAmount,
        invoiceId,
        "success-payment-plan"
      );

      if (paymentData && paymentData.bkashURL) {
        await createCheckoutSession({
          userId,
          mentorId,
          planId,
          packageId,
          paymentMethod: "Bkash",
          totalAmount,
          invoiceId,
          paymentId: paymentData.transactionId,
        });
        return { message: "Bkash Payment Gateway", url: paymentData.bkashURL };
      } else {
        throw new Error("Failed to initiate Bkash payment");
      }
    } catch (error) {
      console.error("Bkash Payment Error:", error);
      throw new Error("Server error during Bkash payment initialization");
    }
  },
};

export async function POST(req) {
  try {
    const formdata = await req.formData();
    const cookieStore = await cookies();
    const userId = formdata.get("user_id") || cookieStore.get("user_id")?.value;
    const paymentMethod = formdata.get("paymentMethod").toLowerCase();
    const planId = formdata.get("plan_id");
    const packageId = formdata.get("package_id");

    console.log("Payment Method:", paymentMethod);
    console.log("Plan ID:", planId);
    console.log("Package ID:", packageId);

    if (!userId) {
      return NextResponse.json(
        {
          status: 401,
          message: "User not authenticated! Please login to continue",
        },
        { status: 401 }
      );
    }

    console.log("User ID:", userId);

    if (!userId || !paymentMethod || !planId || !packageId)
      return handleError("Missing required fields");

    await connectToDB();

    const plan = await MentorshipPlan.findOne({ _id: planId });

    console.log("Plan Data:", plan);
    if (!plan) return handleError("Plan not found");

    const item = plan.plans.find((pkg) => pkg._id.toString() === packageId);
    if (!item) return handleError("Package not found");

    const invoiceId = generateInvoiceId();

    if (paymentGateways[paymentMethod]) {
      const result = await paymentGateways[paymentMethod]({
        item,
        userId,
        mentorId: plan.user,
        planId,
        packageId,
        invoiceId,
      });
      return NextResponse.json(result, { status: 200 });
    }

    return handleError("Invalid payment method");
  } catch (err) {
    console.error("Payment Processing Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
