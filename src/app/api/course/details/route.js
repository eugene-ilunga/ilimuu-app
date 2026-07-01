import { NextResponse } from "next/server";
import Course from "../../../model/courseModel";
import { connectToDB } from "../../../../utils/database";
import User from "../../../model/userModel";
import Category from "@/app/model/categoriesModel";
import CourseReview from "@/app/model/courseReview";
export async function POST(req,res) {
  try {
    const formData = await req.formData();

    const courseid = formData.get("courseid");

    await connectToDB();
    const course = await Course.findOne({_id: courseid}).populate({
        path: "instructor",
        select: " _id name image profession about",
        model: User,
    })
    .populate({
      path: "category",
      select: "_id categoryName",
      model: Category,
    })
    ; // find all users and exclude password field


       // Fetch all reviews for this course
       const reviews = await CourseReview.find({ course: course._id });

       // Calculate total reviews and average rating
       const totalReviews = reviews.length;
       const averageRating = totalReviews
         ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(2)
         : 0;
   
       // Send the course data along with totalReviews and averageRating
       return NextResponse.json({
         status: 200,
         message: "Course fetched successfully",
         data: {
           ...course.toObject(), // Convert Mongoose document to a plain object
           totalReviews,
           averageRating,
         },
       });
  
    

  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
