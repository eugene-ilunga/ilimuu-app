import { NextResponse } from "next/server";
import CheckoutBootcamp from "../../../model/checkoutBootcampModel";
import Bootcamp from "../../../model/bootcampModel";
import { connectToDB } from "../../../../utils/database";
import { cookies } from "next/headers";
import { generateInvoiceId } from "../../../../utils/generateInvoiceID";
import { ObjectId } from "mongodb";
import Settings from "@/app/model/settingModel";

const calculateTotalAmount = (bootcamp, discount = 0) => {
  const basePrice = bootcamp.price;
  const discountAmount = (discount / 100) * basePrice;
  return Math.max(0, basePrice - discountAmount);
};

const createCheckoutSession = async ({
  userId,
  bootcamp,
  paymentMethod,
  totalAmount,
  invoiceId,
}) => {
  const setting = await Settings.findOne();

  const commissionPercentage = setting?.courseCommissionRate ?? 0;
  const commission = (commissionPercentage / 100) * totalAmount;
  const platformFee = setting?.platformServiceFee ?? 0;
  const tax = setting?.taxRate ? ((setting.taxRate / 100) * totalAmount) : 0;
  const earning = totalAmount - commission - platformFee - tax;
  const payoutProcessingTime = setting?.payoutProcessingTime ?? 7;

  console.log("Bootcamp Checkout - Commission:", commission);
  console.log("Bootcamp Checkout - Platform Fee:", platformFee);
  console.log("Bootcamp Checkout - Tax:", tax);

  await CheckoutBootcamp.create({
    user: new ObjectId(String(userId)),
    bootcamp: new ObjectId(String(bootcamp._id)),
    payment_method: paymentMethod,
    payment_id: invoiceId,
    total_amount: totalAmount,
    payment_status: "pending",
    invoice_id: invoiceId,
    amount: earning,
    commission: commission,
    holding_period: payoutProcessingTime,
    platform_fee: platformFee,
    tax: tax,
  });
};

const paymentGateways = {
  stripe: async ({ bootcamp, userId, invoiceId, totalAmount }) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: bootcamp.title,
              description: bootcamp.short_description,
              images: [bootcamp.thumbnail],
            },
            unit_amount: Math.round(totalAmount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/success-bootcamp-enroll?session_id=${invoiceId}`,
      cancel_url: `${process.env.BASE_URL}/bootcamp/${bootcamp._id}?canceled=true`,
    });

    await createCheckoutSession({
      userId,
      bootcamp,
      paymentMethod: "Stripe",
      totalAmount,
      invoiceId,
    });

    return { message: "Stripe Payment Gateway", url: session.url };
  },

  sslcommerz: async ({ bootcamp, userId, invoiceId, totalAmount }) => {
    const sslcommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: invoiceId,
      success_url: `${process.env.BASE_URL}/api/success-bootcamp-enroll?session_id=${invoiceId}`,
      fail_url: `${process.env.BASE_URL}/api/sslcommerz/fail`,
      cancel_url: `${process.env.BASE_URL}/api/sslcommerz/cancel`,
      emi_option: 0,
      cus_name: "Bootcamp Student",
      cus_email: "student@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      cus_fax: "01700000000",
      ship_name: "Bootcamp Student",
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
      product_name: bootcamp.title,
      product_category: "Bootcamp",
      product_profile: "general",
      hours_till_departure: "24",
      product_type: "bootcamp",
      multi_card_name: "mastercard,visacard,amexcard",
      value_a: bootcamp._id,
      value_b: userId,
      value_c: "bootcamp",
      value_d: "sslcommerz",
    };

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sslcommerzData),
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      await createCheckoutSession({
        userId,
        bootcamp,
        paymentMethod: "SSLCommerz",
        totalAmount,
        invoiceId,
      });

      return { message: "SSLCommerz Payment Gateway", url: result.GatewayPageURL };
    } else {
      throw new Error(result.failedreason || "Payment gateway error");
    }
  },

  razorpay: async ({ bootcamp, userId, invoiceId, totalAmount }) => {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: totalAmount * 100, // in paise (multiply by 100 to convert to INR)
      currency: "INR",
      description: `Payment for bootcamp: ${bootcamp.title}`,
      callback_url: `${process.env.BASE_URL}/api/success-bootcamp-enroll?session_id=${invoiceId}`,
    };

    const paymentLink = await razorpay.paymentLink.create(options);

    await createCheckoutSession({
      userId,
      bootcamp,
      paymentMethod: "Razorpay",
      totalAmount,
      invoiceId,
    });

    return { message: "Razorpay Payment Gateway", url: paymentLink.short_url };
  },

  bkash: async ({ bootcamp, userId, invoiceId, totalAmount }) => {
    // Implement bKash payment logic here
    await createCheckoutSession({
      userId,
      bootcamp,
      paymentMethod: "bKash",
      totalAmount,
      invoiceId,
    });

    return { message: "bKash Payment Gateway", url: "/api/bkash/payment" };
  },
};

const handleError = (message) => {
  return NextResponse.json(
    {
      status: 400,
      message,
    },
    { status: 400 }
  );
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const cookiesStore = await cookies();
    const userId = formData.get("user_id") || cookiesStore.get("user_id")?.value;
    const paymentMethod = formData.get("paymentMethod").toLowerCase();
    const bootcampId = formData.get("bootcampId");
    const discount = parseFloat(formData.get("discount")) || 0;

    console.log("Bootcamp Checkout - Payment Method:", paymentMethod);
    console.log("Bootcamp Checkout - Bootcamp ID:", bootcampId);
    console.log("Bootcamp Checkout - User ID:", userId);

    if (!userId || !paymentMethod || !bootcampId) {
      return handleError("Missing required fields");
    }

    await connectToDB();

    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      return handleError("Bootcamp not found");
    }

    // Check if bootcamp is available for enrollment
    if (bootcamp.status !== "approved" && bootcamp.status !== "active") {
      return handleError("Bootcamp is not available for enrollment");
    }

    // Check if application deadline has passed
    if (new Date() > new Date(bootcamp.application_deadline)) {
      return handleError("Application deadline has passed");
    }

    const invoiceId = generateInvoiceId();
    const totalAmount = calculateTotalAmount(bootcamp, discount);

    if (paymentGateways[paymentMethod]) {
      const result = await paymentGateways[paymentMethod]({
        bootcamp,
        userId,
        invoiceId,
        totalAmount,
      });
      return NextResponse.json(result, { status: 200 });
    }

    return handleError("Invalid payment method");
  } catch (err) {
    console.error("Error processing bootcamp payment:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}