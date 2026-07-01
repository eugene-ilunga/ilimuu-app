import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Notification from "@/app/model/notificationModel";
import { cookies } from "next/headers";

export async function POST(req, res) {
  const data = await req.formData();
  const cookieStore = await cookies(); // call it once
  const user_id = data.get("user_id") || cookieStore.get("user_id")?.value;
  const page = data.get("page") || 1;
  const pagination = data.get("pagination") || 10;


  try {
    await connectToDB();
    const notifications = await Notification.find({
      $or: [{ user: user_id }, { broadcast: true }],
    })
    .skip((page - 1) * pagination)
    .sort({ createdAt: -1 });


    return NextResponse.json({ status: 200, notifications });
  } catch (err) {
    return NextResponse.json(
      { status: 400, message: "Error adding notification" },
      { status: 400 }
    );
  }
}
