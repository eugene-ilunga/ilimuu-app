import { connectToDB } from "@/utils/database";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import EnrollCourse from "@/app/model/enrollCourseModel";
import Cart from "@/app/model/cartModel";
import Notification from "@/app/model/notificationModel";
import { NextResponse } from "next/server";


export async function GET(request) {

  const session_id = request.nextUrl.searchParams.get("session_id");
  try {
    await connectToDB();

    // Update the payment status in your database
    const checkout = await CheckoutCourse.findOneAndUpdate(
      { paymentId: session_id },
      { paymentStatus: "completed", paymentDate: new Date() },
      { new: true }
    );

    if (!checkout) {
      return NextResponse.json({ error: "Checkout not found" });
    } else {
      console.log(checkout);
    }

    // Clear the user's cart
    await Cart.findOneAndDelete({ user: checkout.user });

    // Optionally, enroll the user in the purchased course(s) here

    checkout.course.forEach(async (course) => {
      await EnrollCourse.create({
        userId: checkout.user,
        courseId: course,
        enrollmentDate: new Date(),
      });
    });

    // Send a notification to the user about the purchase
    await Notification.create({
      user: checkout.user,
      title: "Course Purchase Successful",
      message: "Your purchase of the course(s) has been successful!",
      type: "CoursePurchase",
    });

    // Redirect the user to a final confirmation page or send a JSON response
    // Here, we'll just send a JSON response for demonstration purposes
    // return NextResponse.json({ message: "Payment successful", checkout });

    return NextResponse.redirect(`${process.env.BASE_URL}/payment-success?invoiceId=${checkout.invoiceId}`);
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json({ error: error.message });
  }
}
