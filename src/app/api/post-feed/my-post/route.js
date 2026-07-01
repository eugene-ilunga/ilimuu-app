import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Post from "@/app/model/postModel";
import User from "@/app/model/userModel";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const formData = await req.formData();
  const userId = formData.get("userId");
  const limit = parseInt(formData.get("pagination")) || 5;
  const pageNumber = parseInt(formData.get("page")) || 1;
  const searchQuery = formData.get("search") || "";

  try {
    await connectToDB();

    // Building the search condition
    const searchCondition = {};
    if (userId) {
      searchCondition.user = new ObjectId(String(userId));
    }
    if (searchQuery) {
      searchCondition.content = { $regex: searchQuery, $options: "i" };
    }

    const total = await Post.countDocuments(searchCondition);

    // Aggregation pipeline to get posts with additional fields
    const data = await Post.aggregate([
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
          userLiked: userId ? { $in: [new ObjectId(userId), "$likes"] } : false,
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
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
    ]);

    return NextResponse.json({ status: 200, data, total });
  } catch (error) {
    return NextResponse.json({ status: 400, message: error.message });
  }
}
