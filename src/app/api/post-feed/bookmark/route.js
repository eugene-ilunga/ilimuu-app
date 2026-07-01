import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import BookmarkPost from "@/app/model/bookmarkPostModel";

export async function POST(req) {
  try {


    const formData = await req.formData();
    const userId = formData.get("userId");
    const postId = formData.get("postId");

    if (!userId || !postId) {
      return NextResponse.json({
        status: 400,
        message: "User ID and Post ID are required.",
      });
    }

    // Connect to the database
    await connectToDB();

    // Check if the bookmark already exists
    const existingBookmark = await BookmarkPost.findOne({ user: userId, post: postId });

    if (existingBookmark) {
      // Unbookmark the post (toggle functionality)
      await BookmarkPost.findByIdAndDelete(existingBookmark._id);
      return NextResponse.json({
        status: 200,
        message: "Bookmark removed successfully.",
      });
    }

    // Create a new bookmark
    const newBookmark = new BookmarkPost({ user: userId, post: postId });
    await newBookmark.save();

    return NextResponse.json({
      status: 201,
      message: "Post bookmarked successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
