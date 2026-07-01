import { NextResponse } from "next/server";
import Post from "../../../model/postModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    const postid = formdata.get("postid");
    const user = formdata.get("userid");
    const comment = formdata.get("comment");
    const replyToCommentId = formdata.get("replyToCommentId");
    const reply = formdata.get("reply");

    await connectToDB();

    const post = await Post.findById({ _id: postid });

    if (!post) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    if (replyToCommentId) {
      // Add a reply to a specific comment
      const commentToReply = post.comments.id(replyToCommentId);
      if (commentToReply) {
        commentToReply.replies.push({ user, reply });
      } else {
        return NextResponse.json({
          status: false,
          message: "Comment not found",
        });
      }
    } else {
      // Add a new comment
      post.comments.push({ user, comment });
    }

    await post.save();

    return NextResponse.json({
      status: 200,
      message: "Post comment successfully",

    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
