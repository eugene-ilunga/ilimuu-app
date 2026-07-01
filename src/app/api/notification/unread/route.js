import { NextResponse } from "next/server";
import Notification from "@/app/model/notificationModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";

export async function POST(req, res) {

    const data = await req.formData();
    const cookiesStore = await cookies();
    const user_id = data.get("user_id") || cookiesStore.get("user_id")?.value;
    
    try {
        await connectToDB();
        const notifications = await Notification.countDocuments({user:user_id,  isRead: false });
        return NextResponse.json({ status: 200, notifications });
    } catch (err) {
        return NextResponse.json(
            { status: 400, message: "Error fetching notifications" },
            { status: 400 }
        );
    }
}
