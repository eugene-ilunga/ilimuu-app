import { NextResponse } from "next/server";
import Bootcamp from "../../model/bootcampModel";
import { connectToDB } from "../../../utils/database";
import User from "../../model/userModel";
import Category from "../../model/categoriesModel";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req, res) {
  try {
    const formdata = await req.formData();
    
    // Get cookies safely
    let role = "";
    let instid = "";
    try {
      const cookieStore = await cookies();
      role = cookieStore.get("role")?.value || "";
      instid = role === "instructor" ? cookieStore.get("user_id")?.value || "" : "";
    } catch (error) {
      console.log("Cookie parsing error:", error);
    }
    
    console.log("Role:", role);
    console.log("Instructor ID:", instid);
    
    const limit = parseInt(formdata.get("pagination")) || 5;
    const pageNumber = parseInt(formdata.get("page")) || 1;
    const searchQuery = formdata.get("search") || "";
    const category = formdata.get("category") || "";
    const subcategory = formdata.get("subcategory") || "";
    const bootcampBadge = formdata.get("bootcampBadge") || "";
    const instructor = formdata.get("instructor") || (instid ? instid : "");
    const minPrice = parseFloat(formdata.get("minPrice")) || 0;
    const maxPrice = parseFloat(formdata.get("maxPrice")) || Number.MAX_VALUE;
    const bootcampType = formdata.get("bootcampType") || "";
    const status = formdata.get("status") || "";
    const level = formdata.get("level") || "";
    const startDateFrom = formdata.get("startDateFrom");
    const startDateTo = formdata.get("startDateTo");

    await connectToDB();

    // Build the search condition
    const searchCondition = {
      ...(searchQuery && {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { short_description: { $regex: searchQuery, $options: "i" } },
        ],
      }),
      ...(category && { category: new ObjectId(String(category)) }),
      ...(subcategory && {
        subCategory: { $regex: subcategory, $options: "i" },
      }),
      ...(instructor && instructor !== "" && { instructor: new ObjectId(String(instructor)) }),
      ...(bootcampBadge && {
        bootcamp_badge: { $regex: bootcampBadge, $options: "i" },
      }),
      ...(bootcampType && { bootcamp_type: bootcampType }),
      ...(level && { level: { $regex: level, $options: "i" } }),
      ...(status && { status: status }),
      price: { $gte: minPrice, $lte: maxPrice },
      ...(startDateFrom && startDateTo && {
        start_date: {
          $gte: new Date(startDateFrom),
          $lte: new Date(startDateTo),
        },
      }),
    };

    const total = await Bootcamp.countDocuments(searchCondition);
    const bootcamps = await Bootcamp.find(searchCondition)
      .populate({
        path: "instructor",
        select: "_id name image profession about",
        model: User,
      })
      .populate({
        path: "co_instructors",
        select: "_id name image profession",
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

    // Calculate additional metrics for each bootcamp
    const bootcampsWithMetrics = bootcamps.map((bootcamp) => {
      const enrolledCount = bootcamp.enrolled_students.length;
      const availableSpots = bootcamp.max_students - enrolledCount;
      const isApplicationOpen = new Date() < new Date(bootcamp.application_deadline);
      const isUpcoming = new Date() < new Date(bootcamp.start_date);
      
      return {
        ...bootcamp.toObject(),
        enrolled_count: enrolledCount,
        available_spots: availableSpots,
        is_application_open: isApplicationOpen,
        is_upcoming: isUpcoming,
        enrollment_percentage: Math.round((enrolledCount / bootcamp.max_students) * 100),
      };
    });

    return NextResponse.json({
      status: 200,
      message: "Bootcamps fetched successfully",
      data: bootcampsWithMetrics,
      total: total,
      totalPages: Math.ceil(total / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error in bootcamp route:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "active";

    await connectToDB();

    const bootcamps = await Bootcamp.find({ status })
      .populate({
        path: "instructor",
        select: "_id name image profession",
        model: User,
      })
      .populate({
        path: "category",
        select: "_id categoryName",
        model: Category,
      })
      .sort({ start_date: 1 })
      .limit(limit);

    return NextResponse.json({
      status: 200,
      message: "Bootcamps fetched successfully",
      data: bootcamps,
    });
  } catch (error) {
    console.error("Error in bootcamp GET route:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
