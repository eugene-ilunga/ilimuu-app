import { NextResponse } from "next/server";
import Post from "../../../model/postModel";
import { connectToDB } from "../../../../utils/database";
import User from "../../../model/userModel";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    const postid = formdata.get("postid");
    await connectToDB();

    const comment = await Post.findById({ _id: postid })
      .select("comments") // Only select the comments field
      .populate({
        path: "comments.user", // Populate user info in comments
        select: "_id name image role",
        model: User,
      })
      .populate({
        path: "comments.replies.user", // Populate user info in comments
        select: "_id name image role",
        model: User,
      })
      .exec();

    // if (!comment) {
    //   return NextResponse.json({
    //     status: 202,
    //     message: "Post not found",
    //   });
    // }

    return NextResponse.json({
      status: 200,
      message: "Post comment successfully",
      data: comment ?? [],
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
