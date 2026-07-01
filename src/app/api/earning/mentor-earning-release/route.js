import CheckoutCourse from '@/app/model/checkoutCourseModel';
import Earnings from '@/app/model/earningModel';
import Course from '@/app/model/courseModel';
import { connectToDB } from '@/utils/database';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const formData = await req.formData();
  const mentorId = formData.get("mentorid");

  if (!mentorId) {
    return NextResponse.json({ status: 400, message: "Mentor ID is required" });
  }

  try {
    await connectToDB();

    const checkouts = await CheckoutCourse.find({
      releasedForWithdrawal: false,
      paymentStatus: "completed",
      releaseDate: { $lte: new Date() },
    });

    if (!checkouts.length) {
      return NextResponse.json({ status: 200, message: "No earnings to release" });
    }

    let earningsReleased = false;

    for (const checkout of checkouts) {
      // Fetch courses related to the checkout to get the instructor ID
      const courses = await Course.find({ 
        _id: { $in: checkout.course },
        instructor: mentorId // filter courses by the specific mentor
      });

      // Skip if no courses match the provided mentor ID
      if (!courses.length) continue;

      // Calculate total earnings for the specific mentor
      const mentorEarnings = checkout.totalAmount / courses.length;

      // Update or create the Earnings record for the mentor
      await Earnings.findOneAndUpdate(
        { user: mentorId },
        { 
          $inc: { 
            availableBalance: mentorEarnings,
            totalEarnings: mentorEarnings 
          } 
        },
        { upsert: true, new: true }
      );

      // Mark the checkout as processed for withdrawal
      checkout.releasedForWithdrawal = true;
      await checkout.save();

      // Mark as earnings released
      earningsReleased = true;
    }

    if (earningsReleased) {
      return NextResponse.json({ status: 200, message: "Earnings released successfully" });
    } else {
      return NextResponse.json({ status: 200, message: "No earnings found for the specified mentor" });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
