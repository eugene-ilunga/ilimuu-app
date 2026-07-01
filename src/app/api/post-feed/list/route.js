import { NextResponse } from "next/server";
import Post from "../../../model/postModel";
import { connectToDB } from "../../../../utils/database";
import User from "../../../model/userModel";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";


export async function POST(req, res) {
  try {
    const formdata = await req.formData();
  const cookieStore = await cookies();

    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const type = formdata.get("type") || "";
    const currentUserId = formdata.get("userId") || cookieStore.get("user_id")?.value;
    //currentUserId is for checking if the user has liked the post or not
    await connectToDB();

    const searchCondition = {};
    if (searchQuery) {
      // Corrected typo here
      searchCondition.content = { $regex: searchQuery, $options: "i" };
    }
    if (type) {
      searchCondition.type = { $regex: type, $options: "i" };
    }

    const total = await Post.countDocuments(searchCondition);

    const post = await Post.aggregate([
      { $match: searchCondition },
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
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
    ]).exec();

    return NextResponse.json({
      status: 200,
      message: "Post fetched successfully",
      data: post,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
