import { NextResponse } from "next/server";
import Post from "../../../model/postModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { postid, userid } = await req.json(); // Parse JSON payload
    console.log("Post ID:", postid); // Debugging line
    console.log("User ID:", userid); // Debugging line

    if (!postid || !userid) {
      return NextResponse.json({
        status: 400,
        message: "Post ID and User ID are required",
      });
    }

    await connectToDB();

    const post = await Post.findById(postid);

    if (!post) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    if (post.likes.includes(userid)) {
      post.likes.pull(userid);
    } else {
      post.likes.push(userid);
    }

    await post.save();

    return NextResponse.json({
      status: 200,
      message: "Post like status updated successfully",
      data: { postid, likes: post.likes.length, liked: post.likes.includes(userid) },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
