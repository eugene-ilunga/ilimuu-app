import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Cart from "@/app/model/cartModel";
import { handleApiError } from "@/utils/errorHandler";
import { cookies } from "next/headers";
import Course from "@/app/model/courseModel";
import SelectField from "@/components/selectField";

export async function POST(req, res) {
  //get all cart data from db

  const formdata = await req.formData();
  const cookieStore = await cookies(); // call it once
    const userid = formdata.get("user_id") || cookieStore.get("user_id")?.value;

  await connectToDB();
  try {
    const cart = await Cart.findOne({ user: userid })
    .populate({
        path: "items.course",
        select: "_id title price thumbnail instructor category",
        model: Course,
        populate: [
          {
            path: "instructor",
            select: "_id name image profession",
          },
          {
            path: "category",
            select: "_id categoryName",
          }
        ]
    });

    if (!cart) {
      return NextResponse.json({
        status: 200,
        message: "Le panier est vide",
        data: null,
      });
    }

    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.course.price * item.quantity;
    }, 0);

    return NextResponse.json({
      status: 200,
      message: "Cart data fetched successfully",
      data: cart,
      totalAmount: totalAmount,
    });
  } catch (e) {
   return NextResponse.json({
      status: 500,
      message: e.message,
    });
  }
}
