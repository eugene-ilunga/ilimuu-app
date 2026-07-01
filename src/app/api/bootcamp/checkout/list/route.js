import { NextResponse } from "next/server";
import Bootcamp from "@/app/model/bootcampModel";
import CheckoutBootcamp from "@/app/model/checkoutBootcampModel";

import { connectToDB } from "../../../../../utils/database";
import User from "@/app/model/userModel";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();

    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const instructorId = formdata.get("mentorid") || "";
    const paymentStatus = formdata.get("paymentStatus") || "";
    const dateRange = formdata.get("dateRange") || "";

    await connectToDB();

    // Build the query filter
    let filter = {};
    if (instructorId) {
      // Get bootcamp IDs for the specified instructor
      const bootcamps = await Bootcamp.find({ instructor: instructorId }).select("_id");
      const bootcampIds = bootcamps.map((bootcamp) => bootcamp._id);
      // Add bootcamp filter to the checkout filter
      filter.bootcamp = { $in: bootcampIds };
    }

    // Add payment status filter
    if (paymentStatus) {
      filter.payment_status = paymentStatus;
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
          { invoice_id: searchRegex },
          { user: { $in: userIds } },
        ];
      } else {
        // If no users found, only search by invoice ID
        filter.invoice_id = searchRegex;
      }
    }

    const total = await CheckoutBootcamp.countDocuments(filter);
    const checkoutList = await CheckoutBootcamp.find(filter)
      .populate({
        path: "user",
        select: "_id name image profession email phone",
        model: User,
      })
      .populate({
        path: "bootcamp",
        select: "_id title price thumbnail instructor",
        model: Bootcamp,
        populate: {
          path: "instructor", // Populate the instructor details
          select: "_id name image profession email",
          model: User,
        },
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    // Transform the data to match the expected format (convert snake_case to camelCase for consistency)
    const transformedData = checkoutList.map((item) => ({
      ...item.toObject(),
      invoiceId: item.invoice_id,
      totalAmount: item.total_amount,
      paymentStatus: item.payment_status,
      paymentMethod: item.payment_method,
      paymentDate: item.payment_date,
      platformFee: item.platform_fee,
      commission: item.commission,
      tax: item.tax,
      amount: item.amount,
      releaseDate: item.release_date,
      bootcamp: item.bootcamp,
      course: item.bootcamp ? [item.bootcamp] : [], // Map bootcamp to course for compatibility
    }));

    return NextResponse.json({
      status: 200,
      message: "Bootcamp Checkout fetched successfully",
      data: transformedData,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
