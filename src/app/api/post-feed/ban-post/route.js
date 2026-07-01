import { NextResponse } from "next/server";
import Post from "@/app/model/postModel";
import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";

export async function POST(req, res) {
  const fromData = await req.formData();
  const postid = fromData.get("postid");
  const userid = fromData.get("userid");

  try {
    await connectToDB();

    const post = await Post.findOne({ _id: postid });

    if (!post) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }
    // delete post and ban user from posting

    await Post.deleteOne({ _id: postid });
    await User.updateOne({ _id: userid }, { isBanfromPosting: true });

    return NextResponse.json({
      status: 200,
      message: "Post deleted and user banned from posting",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
