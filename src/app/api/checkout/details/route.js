import { NextResponse } from "next/server";
import CheckoutCourse from "@/app/model/checkoutCourseModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const invoiceId = request.nextUrl.searchParams.get("invoiceId");
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const checkout = await CheckoutCourse.findOne({
      invoiceId: invoiceId,
    })
      .populate({
        path: "user",
        select: "name email phone image",
      })
      .populate({
        path: "course",
        select: "title price thumbnail short_description",
      });

    if (!checkout) {
      return NextResponse.json(
        { error: "Checkout not found" },
        { status: 404 }
      );
    }

    // Verify user owns this checkout (optional security check)
    if (userId && checkout.user._id.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Checkout details retrieved successfully",
      data: checkout,
    });
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

