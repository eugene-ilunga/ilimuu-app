import { NextResponse } from "next/server";
import CheckoutPlan from "@/app/model/checkoutMentorPlanModel";
import MentorshipPlan from "@/app/model/mentorshipPlanModel";
import { connectToDB } from "../../../../../utils/database";
import User from "@/app/model/userModel";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();

    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const mentorid = formdata.get("mentorid") || "";
    const paymentStatus = formdata.get("paymentStatus") || "";
    const dateRange = formdata.get("dateRange") || "";

    await connectToDB();

    // Build the query filter
    let searchCondition = {};
    
    if (mentorid) {
      searchCondition.mentor = mentorid;
    }

    // Add payment status filter
    if (paymentStatus) {
      searchCondition.paymentStatus = paymentStatus;
    }

    // Add date range filter
    if (dateRange) {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          searchCondition.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "yesterday":
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          searchCondition.createdAt = {
            $gte: startDate,
            $lte: endDate,
          };
          break;
        case "last7days":
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          searchCondition.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "1month":
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          searchCondition.createdAt = {
            $gte: startDate,
            $lte: now,
          };
          break;
        case "6months":
          startDate.setMonth(startDate.getMonth() - 6);
          startDate.setHours(0, 0, 0, 0);
          searchCondition.createdAt = {
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
        searchCondition.$or = [
          { invoiceId: searchRegex },
          { user: { $in: userIds } },
        ];
      } else {
        // If no users found, only search by invoice ID
        searchCondition.invoiceId = searchRegex;
      }
    }

    const total = await CheckoutPlan.countDocuments(searchCondition);

    const checkoutList = await CheckoutPlan.find(searchCondition)
      .populate({
        path: "user",
        select: "_id name image profession email",
        model: User,
      })
      .populate({
        path: "mentor",
        select: "_id name image profession email",
        model: User,
      })
      .populate({
        path: "plan",
        select: "plans", // Only fetch the plans array
        model: MentorshipPlan,
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit)
      .lean();



    const detailedCheckoutList = checkoutList.map((checkout) => {


      console.log(checkout.plan)
      // Check if plan and package details are defined
      const selectedPlan =
        checkout.plan && checkout.plan
          ? checkout.plan.plans.find(
              (data) => data._id.toString() === checkout.package.toString()
            )
          : null;

        


      return {
        _id: checkout._id,
        user: checkout.user,
        mentor: checkout.mentor,
        package: selectedPlan
          ? {
              _id: selectedPlan._id,
              title: selectedPlan.title,
              short_description: selectedPlan.short_description,
              price: selectedPlan.price,
              services: selectedPlan.services,
              createdAt: selectedPlan.createdAt,
              updatedAt: selectedPlan.updatedAt,
            }
          : null, // Return null if no plan is found
        totalAmount: checkout.totalAmount,
        paymentMethod: checkout.paymentMethod,
        paymentStatus: checkout.paymentStatus,
        paymentId: checkout.paymentId,
        invoiceId: checkout.invoiceId,
        paymentDate: checkout.paymentDate,
        createdAt: checkout.createdAt,
        updatedAt: checkout.updatedAt,
        amount: checkout.amount,
        commission: checkout.commission,
        holdingPeriod: checkout.holdingPeriod,
        platformFee: checkout.platformFee,
        tax: checkout.tax,
        releaseDate: checkout.releaseDate,
  
      };
    });

    return NextResponse.json({
      status: 200,
      message: "Plan Checkout fetched successfully",
      data: detailedCheckoutList,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
