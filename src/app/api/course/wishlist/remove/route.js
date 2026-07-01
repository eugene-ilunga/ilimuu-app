import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import wishlistModel from "@/app/model/wishlistModel";

export async function DELETE(req) {
    const data = await req.formData();
    const id = data.get("wishlist_id");

    try {
        await connectToDB();

        // Check if the course is in the user's wishlist
        const existingWishlist = await wishlistModel.findOne({ _id: id });

        if (!existingWishlist) {
            return NextResponse.json(
                { status: 404, message: "Course not found in wishlist" },
                { status: 404 }
            );
        }

        // Remove the course from the wishlist
        await wishlistModel.deleteOne({ _id: id });

        return NextResponse.json(
            { status: 200, message: "Course removed from wishlist" },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { status: 400, message: err.message },
            { status: 400 }
        );
    }
}
