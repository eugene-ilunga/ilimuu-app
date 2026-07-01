import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    await connectToDB();

    const total = await CustomPage.countDocuments();
    const pages = await CustomPage.find({})
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json({
      status: 200,
      message: "All custom pages",
      data: pages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

