import { connectToDB } from '@/utils/database';
import Earnings from '@/app/model/earningModel';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req, res) {

    const formData = await req.formData();
    const cookiesStore = await cookies();
    const mentorId = formData.get("mentorid") || cookiesStore.get("user_id")?.value;
    console.log("Mentor ID:", mentorId);
    console.log(mentorId);
    try {
    await connectToDB();
    const earnings = await Earnings.findOne({ user: mentorId });

    if (!earnings) {
        return NextResponse.json({status:200, error: "No earnings found" });
    }

    return NextResponse.json({status:200,earnings });


} catch (error) {
    return NextResponse.json({ error: error.message });
    }
};
