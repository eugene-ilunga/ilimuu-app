import { NextResponse } from "next/server";
import Post from "@/app/model/postModel";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const postId = formData.get("postId");
    const content = formData.get("content");
    const image = JSON.parse(formData.get("image")); // Supports multiple images
    const video = formData.get("video");
    const status = formData.get("status");
    const type = formData.get("type");

    // Validate if postId is provided
    if (!postId) {
      return NextResponse.json({
        status: 400,
        message: "Post ID is required",
      });
    }

    await connectToDB();

    // Prepare the update object
    const updateData = {};
    if (content) updateData.content = content;
    if (image.length > 0) updateData.image = image;
    if (video) updateData.video = video;
    if (status) updateData.status = status;
    if (type) updateData.type = new ObjectId(String(type));

    // Find and update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true } // Return the updated document
    ).populate("user", "name image role") // Populate user data
     .populate("type"); // Populate type data

    if (!updatedPost) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Post updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
