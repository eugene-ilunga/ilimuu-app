import { NextResponse } from "next/server";
import User from "../../../model/userModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";
import { cookies } from "next/headers";
import { useId } from "react";

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const cookieStore = await cookies();

        const userid = data.get('userid') || cookieStore.get('user_id')?.value;
    
        await connectToDB();
    
        const user = await User.findOne({_id:userid}).select('-password');

        return NextResponse.json({
            status: 200,
            message: "User Details",
            data: user,
        });
    }   catch (error) {
        return handleApiError(error);
    } }
