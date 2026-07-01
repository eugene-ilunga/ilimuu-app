import { NextResponse } from "next/server";
import Course from "@/app/model/courseModel";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import Category from "@/app/model/categoriesModel";
import CourseReview from "@/app/model/courseReview";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    const cookieStore = await cookies();

    const role = cookieStore.get("role")?.value;
    

    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const category = formdata.get("category") || "";
    const subcategory = formdata.get("subcategory") || "";
    const courseBadge = formdata.get("courseBadge") || "";
    const instructor = formdata.get("instructor") || "";
    const level = formdata.get("level") || "";
    const minPrice = parseFloat(formdata.get("minPrice")) || 0;
    const maxPrice = parseFloat(formdata.get("maxPrice")) || Number.MAX_VALUE;
    const minRating = parseFloat(formdata.get("minRating")) || 0; // Add minimum rating filter
    const maxRating = parseFloat(formdata.get("maxRating")) || 5; // Add maximum rating filter
    const status = formdata.get("status") || "";
    const sortValue = formdata.get("sortValue") || "default";


    await connectToDB();

    // Build the search condition
    const searchCondition = {
      ...(searchQuery && {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { shortDescription: { $regex: searchQuery, $options: "i" } },
        ],
      }),
      ...(category && { category: new ObjectId(String(category)) }),
      ...(subcategory && {
        subcategory: { $regex: subcategory, $options: "i" },
      }),
      ...(instructor && { instructor: new ObjectId(String(instructor)) }),
      ...(courseBadge && {
        courseBadge: { $regex: courseBadge, $options: "i" },
      }),
      ...(level && { level: { $regex: level, $options: "i" } }),
      ...(status && { status: status }),
      price: { $gte: minPrice, $lte: maxPrice },
    };

    const total = await Course.countDocuments(searchCondition);
    const courses = await Course.find(searchCondition)
      .populate({
        path: "instructor",
        select: "_id name image profession about",
        model: User,
      })
      .populate({
        path: "category",
        select: "_id categoryName",
        model: Category,
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    // For each course, calculate the total review count and average rating
    const coursesWithReviews = await Promise.all(
      courses.map(async (course) => {
        const reviews = await CourseReview.find({ course: course._id });

        const totalReviews = reviews.length;
        const averageRating =
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          (totalReviews || 1);

        return {
          ...course.toObject(), // Convert Mongoose document to a plain object
          totalReviews,
          averageRating: parseFloat(averageRating.toFixed(2)), // Round to 2 decimal places
        };
      })
    );

    // Filter by averageRating (after calculating the ratings)
    // Filter by rating range
    let filteredCourses = coursesWithReviews.filter(
      (course) =>
        course.averageRating >= minRating && course.averageRating <= maxRating
    );

    // Sort based on `sortValue`
    switch (sortValue) {
      case "popular":
        filteredCourses.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case "newest":
        filteredCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "price-low":
        filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredCourses.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default = Newest
        filteredCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    return NextResponse.json({
      status: 200,
      message: "Courses fetched successfully",
      data: filteredCourses,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}



