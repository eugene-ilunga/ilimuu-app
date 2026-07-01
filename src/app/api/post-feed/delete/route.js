import { NextResponse } from "next/server";
import Post from "@/app/model/postModel";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const formData = await req.formData();
    const postId = formData.get("postId");

    if (!postId) {
      return NextResponse.json({
        status: 400,
        message: "Post ID is required",
      });
    }

    await connectToDB();

    // Attempt to delete the post by its ID
    const result = await Post.deleteOne({ _id: new ObjectId(String(postId)) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
