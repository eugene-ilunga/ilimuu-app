import { NextResponse } from "next/server";
import Cart from "@/app/model/cartModel";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  const formData = await req.formData();
  const cartId = formData.get("cartId");
  const itemId = formData.get("itemId");

  try {
    await connectToDB();

    // Remove the specified item from the cart
    const cart = await Cart.updateOne(
      { _id: new ObjectId(String(cartId)) },
      { $pull: { items: { _id: new ObjectId(String(itemId)) } } }
    );

    // Check if the cart is empty after removing the item
    const updatedCart = await Cart.findById(cartId);

    if (updatedCart && updatedCart.items.length === 0) {
      // If no items are left, delete the entire cart
      await Cart.deleteOne({ _id: new ObjectId(String(cartId)) });
      console.log("Cart is empty, deleted the entire cart");
      return NextResponse.json({
        status: 200,
        message: "Cart was empty and has been deleted",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
