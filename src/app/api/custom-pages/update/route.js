import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOption);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({
        status: 403,
        message: "Unauthorized. Admin access required.",
      });
    }

    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const showInFooter = formData.get("showInFooter") === "true";
    const isActive = formData.get("isActive") === "true";
    const order = parseInt(formData.get("order")) || 0;
    const metaDescription = formData.get("metaDescription") || "";
    const metaKeywords = formData.get("metaKeywords") || "";

    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Page ID is required.",
      });
    }

    await connectToDB();

    // Check if slug already exists for another page
    if (slug) {
      const existingPage = await CustomPage.findOne({ slug, _id: { $ne: id } });
      if (existingPage) {
        return NextResponse.json({
          status: 400,
          message: "A page with this slug already exists.",
        });
      }
    }

    const updateData = {
      updatedBy: session.user.id,
    };

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (showInFooter !== undefined) updateData.showInFooter = showInFooter;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (metaKeywords !== undefined) updateData.metaKeywords = metaKeywords;

    const updatedPage = await CustomPage.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPage) {
      return NextResponse.json({
        status: 404,
        message: "Page not found.",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Custom page updated successfully.",
      data: updatedPage,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

