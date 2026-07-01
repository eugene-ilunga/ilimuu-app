import { NextResponse } from "next/server";
import BookedMentorship from "@/app/model/bookMentorshipModel";
import MentorshipPlan from "@/app/model/mentorshipPlanModel";
import { connectToDB } from "@/utils/database";
import User from "@/app/model/userModel";
import { cookies } from "next/headers";

export async function POST(req, res) {
  const formdata = await req.formData();
  const limit = parseInt(formdata.get("pagination")) || 100;
  const pageNumber = parseInt(formdata.get("page")) || 1;
  const cookieStore = await cookies();
  const user_id = formdata.get("user_id") || cookieStore.get("user_id")?.value;
  

  try {
    await connectToDB();

    const total = await BookedMentorship.countDocuments({ mentor: user_id });
    const enrollList = await BookedMentorship.find({ mentor: user_id })
      .populate({ path: "user", select: "_id name image", model: User })
      .populate({
        path: "plan",
        select: "plans", // Only fetch the plans array
        model: MentorshipPlan,
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip((pageNumber - 1) * limit)
      .lean(); // Convert mongoose document to plain JS object for easier manipulation

      console.log("Enroll List:", enrollList);
    // Extract only the 'package' info from the plan
    const updatedEnrollList = enrollList.map((item) => {
      const packageInfo = item.plan?.plans?.find(
        (pkg) => pkg._id.toString() === item.package.toString()
      );
      return {
        ...item,
        package: packageInfo ? packageInfo : null, // Replace 'plan' with 'package'
        plan: undefined, // Remove the full 'plan' details
      };
    });

    return NextResponse.json({
      status: 200,
      message: "Enroll list fetched successfully",
      enrollList: updatedEnrollList,
      total,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
