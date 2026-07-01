// app/api/contact/route.js
import { NextResponse } from 'next/server';
import Contact from "@/app/model/contact";
import { connectToDB } from "@/utils/database";

// POST request (already defined)
export async function POST(request) {
    try {
        await connectToDB();

        const body = await request.json();
        const { name, email, phone, message } = body;
        const contact = new Contact({
            name,
            email,
            phone,
            message,
        });

        await contact.save();
        console.log('Contact saved:', contact);
        return NextResponse.json({ success: true, message: 'Contact saved successfully.' }, { status: 202 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}





