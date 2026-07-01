import { NextResponse } from "next/server";
import Category from "../../model/categoriesModel";
import { connectToDB } from "@/utils/database";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();

    const limit = formdata.get("pagination") || 5;
    const pageNumber = formdata.get("page") || 1;

    await connectToDB();

    const total = await Category.countDocuments();
    const categories = await Category.find({})
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    return NextResponse.json({
      status: 200,
      message: "Toutes les catégories",
      data: categories,
      total, // Return the total count of items
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// Get all categories with course count
// export async function GET(req) {
//   try {
//     await connectToDB();

//     const categories = await Category.aggregate([
//       {
//         $lookup: {
//           from: "courses", // name of the courses collection
//           localField: "_id",
//           foreignField: "category", // field in the courses collection that references the category
//           as: "courses",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           categoryName: 1,
//           image: 1,
//           courseCount: { $size: "$courses" },
//         },
//       },
//       {
//         $sort: { courseCount: -1 }, // Sort by courseCount DESCENDING
//       },
//     ]);

//     return NextResponse.json({
//       status: 200,
//       message: "Categories with course count",
//       data: categories,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       message: error.message,
//     });
//   }
// }


export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = parseInt(pageParam);
    const limit = parseInt(limitParam);
    const isPaginated = !isNaN(page) && !isNaN(limit);

    const totalCategories = await Category.countDocuments();

    const aggregationPipeline = [
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "category",
          as: "courses",
        },
      },
      {
        $project: {
          _id: 1,
          categoryName: 1,
          image: 1,
          courseCount: { $size: "$courses" },
        },
      },
      {
        $sort: { courseCount: -1 },
      },
    ];

    if (isPaginated) {
      aggregationPipeline.push({ $skip: (page - 1) * limit });
      aggregationPipeline.push({ $limit: limit });
    }

    const categories = await Category.aggregate(aggregationPipeline);

    return NextResponse.json({
      status: 200,
      message: "Categories with course count",
      data: categories,
      total: totalCategories,
      ...(isPaginated && {
        page,
        totalPages: Math.ceil(totalCategories / limit),
      }),
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
