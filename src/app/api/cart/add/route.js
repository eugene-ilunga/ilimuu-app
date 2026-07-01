import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Cart from "@/app/model/cartModel";
import { handleApiError } from "@/utils/errorHandler";
import { cookies } from "next/headers";

export  async function POST (req,res) {
    
  const formdata = await req.formData();
  const cookieStore = await cookies();
  const userid =  formdata.get("user_id") || cookieStore.get("user_id")?.value;
  const courseid = formdata.get("courseid");
  const quantity = formdata.get("quantity") || 1;
  await connectToDB();

  try {
    if(!userid) {
      return NextResponse.json({
        status: 401,
        message: "User not authenticated! Please login to continue",
      });
    }
    if (!courseid) {
      return NextResponse.json({
        status: 400,
        message: "Course ID is required",
      });
    }
    // Check if the user already has a cart
    let cart = await Cart.findOne({ user: userid });

    if (!cart) {
      cart = await Cart.create({
        user: userid,
        items: [],
      });
    }

    // Check if the course is already in the cart

    const existingItemIndex = cart.items.findIndex(
      (item) => item.course.toString() == courseid
    );

    if (existingItemIndex > -1) {
      return NextResponse.json({
        status: 409,
        message: "Item already exists in the cart",
      });
      // cart.items[existingItemIndex].quantity += (quantity);
      // cart.items[existingItemIndex].price += (price);
    } else {
      cart.items.push({
        course: courseid,
        quantity: quantity,
      });
    }

   

    await cart.save();

    return NextResponse.json({
      status: 200,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.error(err);
    return handleApiError(err);
  }
}
