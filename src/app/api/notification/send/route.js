import Notification from "@/app/model/notificationModel";
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { group } from "console";

export async function POST(req, res) {
  const {
    title,
    message,
    type,
    userGroup, // Targeted user group (e.g., students, mentors)
    specificUserEmail,   // 👈 NEW: for targeting one user by Email

    additionalFilters, // Optional filters for targeting users
    createdBy, // Admin who sends the notification
    broadcast, // Whether it's a broadcast
    actionLink, // Optional action link for the notification
  } = await req.json();

   try {
    if (!title || !message || !type) {
      return NextResponse.json({
        status: 400,
        message: "Title, message, and type are required.",
      });
    }

    await connectToDB();

    let targetedUsers = [];

    // ✅ Case 1: Specific user by ID or Email
    if (userGroup === "specific") {
      let user = null;

    if (specificUserEmail) {
        user = await User.findOne({ email: specificUserEmail }).select("_id");
      }

      if (!user) {
        return NextResponse.json({
          status: 404,
          message: "User not found.",
        });
      }
      targetedUsers = [user];
    } 
    // ✅ Case 2: Groups
    else {
      let userQuery = {};

      if (userGroup === "students") {
        userQuery.role = "student";
      } else if (userGroup === "mentors") {
        userQuery.role = "mentor";
      } else if (userGroup === "newStudents") {
        userQuery = {
          role: "student",
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        };
      } else if (userGroup === "newMentors") {
        userQuery = {
          role: "mentor",
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        };
      }

      if (additionalFilters) {
        Object.keys(additionalFilters).forEach((key) => {
          userQuery[key] = additionalFilters[key];
        });
      }

      targetedUsers = await User.find(userQuery).select("_id");
    }

    if (targetedUsers.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No users found for the given criteria.",
      });
    }

    // ✅ Avoid duplicates
    const existingNotifications = await Notification.find({
      title,
      message,
      type,
      user: { $in: targetedUsers.map((u) => u._id) },
    }).select("user");

    const existingUserIds = new Set(
      existingNotifications.map((n) => n.user.toString())
    );

    const newNotifications = targetedUsers
      .filter((u) => !existingUserIds.has(u._id.toString()))
      .map((u) => ({
        user: u._id,
        title,
        message,
        type,
        createdBy,
        broadcast: broadcast || false,
        actionLink: actionLink || null,
      }));

    if (newNotifications.length === 0) {
      return NextResponse.json({
        status: 200,
        message: "No new notifications to send. Duplicates avoided.",
      });
    }

    await Notification.insertMany(newNotifications);

    return NextResponse.json({
      status: 200,
      message: "Notifications sent successfully.",
      count: newNotifications.length,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error while sending notifications.",
      error: error.message,
    });
  }

}

export async function GET(req, res) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1"); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "5"); // Default to 5 items per page
    const skip = (page - 1) * limit;

    // Retrieve notifications grouped by title and message
    const groupedNotificationsPipeline = [
      { $match: { type: "AdminNotification" } },
      {
        $group: {
          _id: { title: "$title", message: "$message", recipients: "$userGroup" },
          count: { $sum: 1 },
          lastSent: { $max: "$createdAt" },
        },
      },
      { $sort: { lastSent: -1 } },
    ];

    // Get grouped notifications with pagination
    const notifications = await Notification.aggregate([
      ...groupedNotificationsPipeline,
      { $skip: skip }, // Skip documents for pagination
      { $limit: limit }, // Limit the number of documents
    ]);

    // Count total grouped notifications
    const totalGroupedNotifications = await Notification.aggregate([
      ...groupedNotificationsPipeline,
      { $count: "totalCount" },
    ]);

    const totalNotifications =
      totalGroupedNotifications.length > 0 ? totalGroupedNotifications[0].totalCount : 0;
    const totalPages = Math.ceil(totalNotifications / limit);

    return NextResponse.json({
      status: 200,
      notifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotifications,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error fetching notifications.",
      error: error.message,
    });
  }
}

