import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import wishlistModel from "@/app/model/wishlistModel";

export async function POST(req) {
    const data = await req.formData();
    const user = data.get("user");
    const course = data.get("course");

    try {
        await connectToDB();

        // Check if the course is already in the wishlist for this user
        const existingWishlist = await wishlistModel.findOne({ user, course });

        if (existingWishlist) {
            return NextResponse.json(
                { status: 200, message: "Course is already in wishlist" },
                { status: 200 }
            );
        }

        // If not, add the course to the wishlist
        await wishlistModel.create({ user, course });

        return NextResponse.json(
            { status: 200, message: "Course added to wishlist" },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { status: 400, message: err.message },
            { status: 400 }
        );
    }
}
