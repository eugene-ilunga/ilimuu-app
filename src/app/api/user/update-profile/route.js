import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";



export async function PUT(request) {

    try {
        const { userId, name, email, image } = await request.json();
        await connectToDB();

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { name, email, image },
            { new: true }
        );
        return NextResponse.json({
            success: true,
            message: "user Updated",
            data: updateUser
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Update Failed"
        })
    }

}