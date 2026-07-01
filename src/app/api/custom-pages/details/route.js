import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({
        status: 400,
        message: "Page ID or slug is required.",
      });
    }

    await connectToDB();

    let page;
    if (id) {
      page = await CustomPage.findById(id);
    } else {
      page = await CustomPage.findOne({ slug, isActive: true });
    }

    if (!page) {
      return NextResponse.json({
        status: 404,
        message: "Page not found.",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Page details fetched successfully.",
      data: page,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

