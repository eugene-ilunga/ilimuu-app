import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Course from "@/app/model/courseModel";
import Category from "@/app/model/categoriesModel";

export async function GET(req) {
  try {
    await connectToDB();

    const topCategories = await Course.aggregate([
      {
        $group: {
          _id: "$category", // Group by the `category` field in the `Course` model
          totalCourses: { $sum: 1 }, // Count courses per category
        },
      },
      {
        $sort: { totalCourses: -1 }, // Sort by totalCourses in descending order
      },
      {
        $limit: 5, // Limit to the top 5 categories
      },
      {
        $lookup: {
          from: "categories", // The collection name for the `Category` model
          localField: "_id", // `_id` from the `$group` stage
          foreignField: "_id", // `_id` in the `Category` collection
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails", // Flatten the `categoryDetails` array
      },
      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.categoryName", // Category name from the `Category` model
          totalCourses: 1, // Total courses count
        },
      },
    ]);

    // Map the result to the required chartData format
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];

    const chartData = topCategories.map((category, index) => ({
      category: category.categoryName,
      courses: category.totalCourses,
      fill: colors[index] || "hsl(var(--chart-other))", // Fallback color
    }));

    // Generate chartConfig
    const chartConfig = topCategories.reduce((config, category, index) => {
      const key = category.categoryName.toLowerCase().replace(/\s+/g, "_"); // Create a unique key
      config[key] = {
        label: category.categoryName,
        color: colors[index] || "hsl(var(--chart-other))",
      };
      return config;
    }, {
      visitors: { label: "Visitors" },
    });

    return NextResponse.json({
      status: 200,
      message: "Top 5 Categories",
      chartData,
      chartConfig,
    });
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
