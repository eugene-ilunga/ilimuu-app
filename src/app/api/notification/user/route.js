import { NextResponse } from "next/server";
import User from "@/app/model/userModel";
import Notification from "@/app/model/notificationModel";
import { connectToDB } from "@/utils/database";

export async function POST(req, res) {
  const fromData = await req.formData();
  const userid = fromData.get("userid");
  const title = fromData.get("title");
  const message = fromData.get("message");
  const type = fromData.get("type");


  try {
    await connectToDB();

    const user = await User.findOne({ _id: userid });

    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }

    const notificationData = {
      user: userid,
        title: title,
      message: message,
      type: type,
    };

    await Notification.create(notificationData);

    return NextResponse.json({
      status: 200,
      message: "Notification sent successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
