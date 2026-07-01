import CheckoutCourse from '@/app/model/checkoutCourseModel';
import CheckoutPlan from '@/app/model/checkoutMentorPlanModel';
import Earnings from '@/app/model/earningModel';
import Course from '@/app/model/courseModel';
import { connectToDB } from '@/utils/database';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req, res) {
  const cookiesStore = await cookies();
  const superAdminId = cookiesStore.get('user_id')?.value;

  try {
    await connectToDB();

    // Find course checkouts
    const courseCheckouts = await CheckoutCourse.find({
      releasedForWithdrawal: false,
      paymentStatus: "completed",
      releaseDate: { $lte: new Date() },
    });

    // Find plan checkouts
    const planCheckouts = await CheckoutPlan.find({
      releasedForWithdrawal: false,
      paymentStatus: "completed",
      releaseDate: { $lte: new Date() },
    });

    // Calculate total earnings for courses
    const totalCourseEarnings = courseCheckouts.reduce(
      (sum, checkout) => sum + checkout.totalAmount,
      0
    );

    // Calculate total earnings for plans
    const totalPlanEarnings = planCheckouts.reduce(
      (sum, checkout) => sum + checkout.totalAmount,
      0
    );

    // Calculate grand total earnings
    const totalEarnings = totalCourseEarnings + totalPlanEarnings;

    // Process course checkouts
    for (const checkout of courseCheckouts) {
      const courses = await Course.find({ _id: { $in: checkout.course } });

      for (const course of courses) {
        const instructorId = course.instructor;

        if (instructorId) {
          const instructorShare = (checkout.totalAmount / courses.length) * 0.9; // 90% to instructor
          const superAdminShare = (checkout.totalAmount / courses.length) * 0.1; // 10% to super admin

          // Update instructor earnings
          await Earnings.findOneAndUpdate(
            { user: instructorId },
            {
              $inc: {
                availableBalance: instructorShare,
                totalEarnings: instructorShare,
              },
            },
            { upsert: true, new: true }
          );

          // Update super admin earnings
          await Earnings.findOneAndUpdate(
            { user: superAdminId },
            {
              $inc: {
                availableBalance: superAdminShare,
                totalEarnings: superAdminShare,
              },
            },
            { upsert: true, new: true }
          );
        }
      }

      checkout.releasedForWithdrawal = true;
      await checkout.save();
    }

    // Process plan checkouts
    for (const checkout of planCheckouts) {
      const mentorId = checkout.mentor;

      if (mentorId) {
        const mentorShare = checkout.totalAmount * 0.9; // 90% to mentor
        const superAdminShare = checkout.totalAmount * 0.1; // 10% to super admin

        // Update mentor earnings
        await Earnings.findOneAndUpdate(
          { user: mentorId },
          {
            $inc: {
              availableBalance: mentorShare,
              totalEarnings: mentorShare,
            },
          },
          { upsert: true, new: true }
        );

        // Update super admin earnings
        await Earnings.findOneAndUpdate(
          { user: superAdminId },
          {
            $inc: {
              availableBalance: superAdminShare,
              totalEarnings: superAdminShare,
            },
          },
          { upsert: true, new: true }
        );
      }

      checkout.releasedForWithdrawal = true;
      await checkout.save();
    }

    return NextResponse.json({
      status: 200,
      message: "Earnings released successfully",
      data: {
        totalCourseEarnings,
        totalPlanEarnings,
        totalEarnings,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
