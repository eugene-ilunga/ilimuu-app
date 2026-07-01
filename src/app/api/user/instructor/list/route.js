import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender"); // e.g., "male", "female", etc.
  const isVerified = searchParams.get("isVerified"); // expected "true" or "false"
  const minRating = parseFloat(searchParams.get("minRating")); // optional min rating

  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);
  const skip = (page - 1) * limit;

  await connectToDB();

  // Base filter
  let filter = { role: "instructor", status: "active" };

  // Search query
  if (searchQuery) {
    filter = {
      ...filter,
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { profession: { $regex: searchQuery, $options: "i" } },
        { expartise: { $in: [searchQuery.toLowerCase()] } },
      ],
    };
  }

  // Category filter
  if (category) {
    filter.expartise = { $in: [category] };
  }

  // Gender filter
  if (gender) {
    filter.gender = gender;
  }

  // isVerified filter
  if (isVerified === "true") {
    filter.isVerified = true;
  } else if (isVerified === "false") {
    filter.isVerified = false;
  }

  // Sort logic
  let sort = {};
  if (sortParam === "newest") {
    sort = { createdAt: -1 };
  } else if (sortParam === "highestRated") {
    sort = { rating: -1 };
  } else if (sortParam === "priceLowToHigh") {
    sort = { hourlyRate: 1 };
  } else if (sortParam === "priceHighToLow") {
    sort = { hourlyRate: -1 };
  }

  try {
    const result = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "mentorreviews",
          localField: "_id",
          foreignField: "mentorId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          rating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              null,
            ],
          },
          reviews: { $size: "$reviews" },
        },
      },
      // Optional: Filter by minRating
 
      ...(isNaN(minRating)
        ? []
        : [
            {
              $match: {
                rating: { $ne: null, $gte: minRating },
              },
            },
          ]),

      {
        $project: {
          name: 1,
          image: 1,
          profession: 1,
          country: 1,
          hourlyRate: 1,
          expartise: 1,
          gender: 1,
          isVerified: 1,
          rating: {
            $cond: [{ $ne: ["$rating", null] }, { $round: ["$rating", 1] }, 0],
          },
          reviews: 1,
        },
      },
      {
        $facet: {
          data: [
            ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const instructors = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: instructors,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching instructors with pagination:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
