import { NextResponse } from "next/server";
import Banner from "@/app/model/bannerModel";
import { connectToDB } from "@/utils/database";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit;

    // Fetch banners with pagination
    const banners = await Banner.find({})
      .skip(skip)
      .limit(limit);

    // Total count of documents
    const total = await Banner.countDocuments({});

    return NextResponse.json({
      status: 200,
      message: "Banner list",
      banners,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to fetch banners", error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  const body = await request.json();
  await connectToDB();
  const newBanner = new Banner(body);
  await newBanner.save();
  return NextResponse.json({
    status: 201,
    message: "Banner added successfully",
  });
}
