

import AdmissionMessage from "@/app/model/admissionMessageModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

// DELETE request
export async function DELETE(req){
    try{
        await connectToDB();

        const { searchParams } = new URL(req.url)
        const id  = searchParams.get('id');
        if(!id){
            return NextResponse.json({success: false, error: 'Missing Contact ID.'}, {status: 400});
        }

        const result  = await AdmissionMessage.findByIdAndDelete(id);
        if(!result){
            return NextResponse.json({success: false, error: 'Contact not found.'}, {status: 404});
        } 
        return NextResponse.json({success: true, message: 'Contact deleted successfully.'}, {status: 200});

    }catch(error){
        return NextResponse.json({ success: false, error: error.message }, { status: 500});
    }
}
