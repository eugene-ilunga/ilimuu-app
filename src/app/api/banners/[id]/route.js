import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Banner from "@/app/model/bannerModel";

export async function GET(request, { params }) {
  await connectToDB();
  const banner = await Banner.findById(params.id);
  if (!banner) {
    return NextResponse.json({ message: "Banner not found", status:404 });
  }
  return NextResponse.json(banner);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  await connectToDB();
  const updatedBanner = await Banner.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  if (!updatedBanner) {
    return NextResponse.json( { status: 404 , message: "Banner not found"},);
  }
  return NextResponse.json({status: 200, message: "Banner updated successfully", updatedBanner});
}

export async function DELETE(request, { params }) {
  await connectToDB();
  const deletedBanner = await Banner.findByIdAndDelete(params.id);
  if (!deletedBanner) {
    return NextResponse.json({ status: 404, message: "Banner not found" });
  }
  return NextResponse.json({ status:200, message: "Banner deleted successfully" });
}
