import { connectToDB } from "@/utils/database";
import BookmarkPost from "@/app/model/bookmarkPostModel";
import { NextResponse } from "next/server";
import Post from "@/app/model/postModel";
import User from "@/app/model/userModel";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId");

    if (!userId) {
      return NextResponse.json({
        status: 400,
        message: "User ID is required.",
      });
    }

    // Connect to the database
    await connectToDB();

    // Find bookmarks for the user
    const bookmarks = await BookmarkPost.find({ user: userId })
    .populate({
      path: "post",
      select: ["title", "content", "image", "video", "type", "status", "createdAt"],
      populate: {
        path: "user",
        select: "name image",
        model: "User",
      },
      model: "Post",
    })
    .sort({ createdAt: -1 });
  

    return NextResponse.json({
      status: 200,
      message: "Bookmarked posts fetched successfully.",
      data: bookmarks.map((bookmark) => bookmark.post),
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
