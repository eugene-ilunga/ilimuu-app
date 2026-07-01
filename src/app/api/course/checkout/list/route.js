import { NextResponse } from "next/server";
import Course from "@/app/model/courseModel";
import CheckoutCourse from "@/app/model/checkoutCourseModel";

import { connectToDB } from "../../../../../utils/database";
import User from "@/app/model/userModel";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();

    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const mentorId = formdata.get("mentorid") || "";
    const paymentStatus = formdata.get("paymentStatus") || "";
    const dateRange = formdata.get("dateRange") || "";

    await connectToDB();

    // Build the query filter
    let filter = {};
    if (mentorId) {
      // Get course IDs for the specified mentor
      const courses = await Course.find({ instructor: mentorId }).select("_id");
      const courseIds = courses.map((course) => course._id);
      // Add course filter to the checkout filter
      filter.course = { $in: courseIds };
    }

    // Add payment status filter
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Add date range filter
    if (dateRange) {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          filter.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "yesterday":
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          filter.createdAt = {
            $gte: startDate,
            $lte: endDate,
          };
          break;
        case "last7days":
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          filter.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "1month":
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          filter.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "6months":
          startDate.setMonth(startDate.getMonth() - 6);
          startDate.setHours(0, 0, 0, 0);
          filter.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
      }
    }

    // Handle search query - search by invoice ID, user name, or user email
    if (searchQuery) {
      const searchRegex = { $regex: searchQuery, $options: "i" };
      
      // First, try to find users matching the search
      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
        ],
      }).select("_id");
      
      const userIds = matchingUsers.map((user) => user._id);
      
      // Build search filter
      if (userIds.length > 0) {
        filter.$or = [
          { invoiceId: searchRegex },
          { user: { $in: userIds } },
        ];
      } else {
        // If no users found, only search by invoice ID
        filter.invoiceId = searchRegex;
      }
    }

    const total = await CheckoutCourse.countDocuments(filter);
    const checkoutList = await CheckoutCourse.find(filter)
      .populate({
        path: "user",
        select: "_id name image profession email",
        model: User,
      })
      .populate({
        path: "course",
        select: "_id title price thumbnail instructor",
        model: Course,
        populate: {
          path: "instructor", // Populate the instructor details
          select: "_id name image profession email",
          model: User,
        },
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    return NextResponse.json({
      status: 200,
      message: "Course Checkout fetched successfully",
      data: checkoutList,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
