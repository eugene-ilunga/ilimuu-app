import { NextResponse } from "next/server";
import CustomPage from "../../../model/customPageModel";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOption);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({
        status: 403,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Page ID is required.",
      });
    }

    await connectToDB();

    const deletedPage = await CustomPage.findByIdAndDelete(id);

    if (!deletedPage) {
      return NextResponse.json({
        status: 404,
        message: "Page not found.",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Custom page deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

