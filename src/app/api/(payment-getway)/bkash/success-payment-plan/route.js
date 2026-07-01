import { connectToDB } from "@/utils/database";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import BookedMentorship from "@/app/model/bookMentorshipModel";
import Notification from "@/app/model/notificationModel";
import { NextResponse } from "next/server";
const BASE_URL = process.env.BKASH_BASE_URL;
const APP_KEY = process.env.BKASH_APP_KEY;
let accessToken = null;

// Generate access token
async function generateToken() {
  try {
    const response = await fetch(`${BASE_URL}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.BKASH_USERNAME,
        password: process.env.BKASH_PASSWORD,
      },
      body: JSON.stringify({
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      }),
    });


    const data = await response.json();
    console.log("Token generation data:", data);

    if (data.id_token) {
      accessToken = data.id_token; // Store the token
      return accessToken;
    } else {
      throw new Error("Token generation failed");
    }
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate access token");
  }
}

export async function GET(req) {
  await connectToDB();

  const paymentID = req.nextUrl.searchParams.get("paymentID");

  try {
    if (!accessToken) {
        await generateToken();
      }
    const result = await fetch(
        `${BASE_URL}/checkout/payment/execute/${paymentID}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: accessToken,
            "X-APP-Key": APP_KEY,
          },
        }
      );
      console.log("Payment execution result:", result);
      const dataResult = await result.json();

      console.log("Payment execution result:", dataResult);

      await connectToDB();

      try {
        const checkout = await CheckoutPlan.findOneAndUpdate(
          { invoiceId: paymentID },
          { paymentStatus: "completed", paymentDate: new Date() },
          { new: true }
        );
    
        if (!checkout) {
          return NextResponse.json({ error: "Checkout not found" });
        } else {
          console.log(checkout);
        }
    
    
        const date = new Date();
        const endDate = date.setDate(date.getDate() + 30);
          await BookedMentorship.create({
            user: checkout.user,
            mentor: checkout.mentor,
            plan: checkout.plan,
            package: checkout.package,
            purchaseDate: new Date(),
            startDate: new Date(),
            endDate: endDate,
          });
      
    
        // Send a notification to the user about the purchase
        await Notification.create({
          user: checkout.user,
          title: "Mentorship booked Successful",
          message: "Your mentorship has been successful booked!",
          type: "BookMentorShip",
        });
    
        // Redirect the user to a final confirmation page or send a JSON response
        // Here, we'll just send a JSON response for demonstration purposes
        // return NextResponse.json({ message: "Payment successful", checkout });
    
        return NextResponse.redirect(`${process.env.BASE_URL}`);
      } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json({ error: error.message });
      }

  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json({ error: error.message });
  }
}
