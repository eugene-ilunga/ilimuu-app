import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Notification from "@/app/model/notificationModel";

export async function POST(req, res) {
  const data = await req.formData();

  try{

  const notificationData = {
    user: data.get("user"),
    title: data.get("title"),
    message: data.get("message"),
    type: data.get("type"),
    createdBy: data.get("createdBy"),
  };

  await connectToDB();

  await Notification.create(notificationData);

  return NextResponse.json(
    { status: 200, message: "Notification added successfully" },
    { status: 200 }
  );
}
catch(err){
  return NextResponse.json(
    { status: 400, message: "Error adding notification",error: err.message },
    { status: 400 }
  );
}
}
