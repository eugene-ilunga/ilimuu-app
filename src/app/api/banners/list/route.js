import Post from "@/app/model/postModel";
import Banner from "@/app/model/bannerModel";
import User from "@/app/model/userModel";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";
export async function GET(req, res) {
  await connectToDB();

  try {
    // Fetch banners and posts concurrently
    const [banners, posts] = await Promise.all([
      Banner.find({ isActive: true }).sort({ position: 1 }),
      Post.find({ isBanner: true }).populate({
        
        path:"user",
        select: "name image",
        model: User
      },
    
    ).select(["content", "image", "type", "status", "createdAt",]),
    ]);

    // Add a type field to each item
    const bannersWithType = banners.map((banner) => ({
      ...banner.toObject(),
      type: "banner",
    }));

    const postsWithType = posts.map((post) => ({
      ...post.toObject(),
      type: "post",
    }));

    // Combine into a single array
    const combinedData = [...bannersWithType, ...postsWithType];

    return NextResponse.json({
      status: 200,
      message: "Banners and posts",
      banners: combinedData,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
