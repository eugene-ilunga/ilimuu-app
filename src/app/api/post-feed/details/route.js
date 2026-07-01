import { NextResponse } from "next/server";
import Post from "@/app/model/postModel";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Extract post ID from the query parameters
    const fromData = await req.formData();
    const postId = fromData.get("id");
    const currentUserId = fromData.get("userId");

    if (!postId) {
      return NextResponse.json({
        status: 400,
        message: "Post ID is required",
      });
    }

    await connectToDB();

    const post = await Post.aggregate([
      { $match: { _id: new ObjectId(postId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          totalLikes: { $size: "$likes" },
          totalComments: { $size: "$comments" },
          totalShares: { $size: "$shares" },
          userLiked: currentUserId
            ? { $in: [new ObjectId(currentUserId), "$likes"] }
            : false,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          image: 1,
          video: 1,
          type: 1,
          status: 1,
          createdAt: 1,
          totalLikes: 1,
          totalComments: 1,
          totalShares: 1,
          userLiked: 1,
          "user._id": 1,
          "user.name": 1,
          "user.image": 1,
          "user.role": 1,
          comments: 1, // Include comments if needed
        },
      },
    ]).exec();

    if (!post.length) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Post details fetched successfully",
      data: post[0], // Return the first (and only) result
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
