import { NextResponse  } from "next/server";
import { connectToDB } from "@/utils/database";
import wishlistModel from "@/app/model/wishlistModel";
import Course from "@/app/model/courseModel";

export async function POST(req) {
    const data = await req.formData();
    const user = data.get("user");    
    
    try { 
        await connectToDB();
        const wishlist = await wishlistModel.find({user})
        .populate({
            path: "course",
            select: "title thumbnail price",
            model: Course
        })
        .sort({ createdAt: -1 })
        ;
        return NextResponse.json(
            { status: 200, wishlist },
            { status: 200 }
        );
    }
    catch (err) {
        return NextResponse.json(
            { status: 400, message: err.message },
            { status: 400 }
        );
    }
}