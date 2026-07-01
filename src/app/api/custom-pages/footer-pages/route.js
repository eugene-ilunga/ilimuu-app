import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";

export async function GET(req) {
  try {
    await connectToDB();

    // Get all active pages for footer (ignoring showInFooter toggle)
    const pages = await CustomPage.find({
      isActive: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .select("title slug _id");

    return NextResponse.json({
      status: 200,
      message: "Footer pages fetched successfully.",
      data: pages,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

