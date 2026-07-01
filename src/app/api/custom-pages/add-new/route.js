import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOption);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({
        status: 403,
        message: "Unauthorized. Admin access required.",
      });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const showInFooter = formData.get("showInFooter") === "true";
    const isActive = formData.get("isActive") === "true";
    const order = parseInt(formData.get("order")) || 0;
    const metaDescription = formData.get("metaDescription") || "";
    const metaKeywords = formData.get("metaKeywords") || "";

    if (!title || !slug || !content) {
      return NextResponse.json({
        status: 400,
        message: "Title, slug, and content are required.",
      });
    }

    await connectToDB();

    // Check if slug already exists
    const existingPage = await CustomPage.findOne({ slug });
    if (existingPage) {
      return NextResponse.json({
        status: 400,
        message: "A page with this slug already exists.",
      });
    }

    const newPage = new CustomPage({
      title,
      slug,
      content,
      showInFooter,
      isActive,
      order,
      metaDescription,
      metaKeywords,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await newPage.save();

    return NextResponse.json({
      status: 200,
      message: "Custom page created successfully.",
      data: newPage,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

