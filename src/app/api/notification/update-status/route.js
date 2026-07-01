import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Notification from "@/app/model/notificationModel";
import { cookies } from "next/headers";

export async function POST(req) {
  const data = await req.formData();
  const cookiesStore = await cookies();
  const user_id = data.get("user_id") || cookiesStore.get("user_id")?.value;
  const notification_id = data.get("notification_id");
  const status = data.get("status");
  const markAllRead = data.get("markAllRead"); // Check if marking all as read is requested

  try {
    await connectToDB();

    if (markAllRead === "true") {
      // Mark all notifications as read for the user
      const updated = await Notification.updateMany(
        { user: new Object(String(user_id)), isRead: false },
        { $set: { isRead: true } }
      );
      return NextResponse.json({
        status: 200,
        message: `${updated.nModified} notifications marked as read.`,
      });
    }

    // Handle single notification update
    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return NextResponse.json(
        { status: 404, message: "Notification not found" },
        { status: 404 }
      );
    }

    notification.isRead = status;
    await notification.save();

    return NextResponse.json({
      status: 200,
      message: "Notification status updated successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { status: 400, message: "Error updating notification status" },
      { status: 400 }
    );
  }
}
