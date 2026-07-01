import { connectToDB } from "@/utils/database";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import BookedMentorship from "@/app/model/bookMentorshipModel";
import Notification from "@/app/model/notificationModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDB();

  const session_id = request.nextUrl.searchParams.get("session_id");
  try {
    const checkout = await CheckoutPlan.findOneAndUpdate(
      { invoiceId: session_id },
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
}


