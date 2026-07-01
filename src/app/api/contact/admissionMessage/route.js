// app/api/admissionMessage/route.js

import AdmissionMessage from "@/app/model/admissionMessageModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";


export async function POST(request){
    try {
        await connectToDB();
        const body = await request.json();
        const { name, email, phone, courseName, message} = body;
        const admissionMessage = new AdmissionMessage({
            name,
            email,
            phone,
            courseName,
            message,
        })
        await admissionMessage.save();
        console.log('Admission message saved: ', admissionMessage)
        return NextResponse.json({success: true, message: 'Admission message saved successfully.'}, {status: 202});

    } catch (error) {
        console.error(error.message);
        return NextResponse.json({success: false, error: error.message}, {status: 400});
    }
}



