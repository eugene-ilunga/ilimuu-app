import { NextResponse } from "next/server";
import MentorshipPlan from "@/app/model/mentorshipPlanModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST(req, res) {
  const formData = await req.formData();
  const cookiesStore = await cookies();
  const userid = formData.get("user_id") || cookiesStore.get("user_id")?.value;

  const starter_short_description = formData.get("starter_short_description");
  const starter_charge = formData.get("starter_charge");
  const starter_services = JSON.parse(formData.get("starter_service"));

  const advanced_short_description = formData.get("advanced_short_description");
  const advanced_charge = formData.get("advanced_charge");
  const advanced_services = JSON.parse(formData.get("advanced_service"));

  const premium_short_description = formData.get("premium_short_description");
  const premium_charge = formData.get("premium_charge");
  const premium_services = JSON.parse(formData.get("premium_service"));
  const planid = formData.get("plan_id");

  try {
    await connectToDB();

    if (planid) {
      // Fetch the existing document
      const existingPlan = await MentorshipPlan.findById(planid);

      if (!existingPlan) {
        return NextResponse.json(
          {
            success: false,
            message: "Mentorship plan not found",
          },
          { status: 404 }
        );
      }

      // Update the fields
      existingPlan.user = userid;
      existingPlan.plans = [
        {
          title: "Starter",
          short_description: starter_short_description,
          price: starter_charge,
          services: starter_services,
        },
        {
          title: "Avancé",
          short_description: advanced_short_description,
          price: advanced_charge,
          services: advanced_services,
        },
        {
          title: "Premium",
          short_description: premium_short_description,
          price: premium_charge,
          services: premium_services,
        },
      ];

      // Save the updated document
      await existingPlan.save();

      return NextResponse.json(
        {
          success: true,
          message: "Mentorship plans updated successfully",
        },
        { status: 201 }
      );
    } else {
      // Create and save a new mentorship plan document
      const newMentorshipPlan = new MentorshipPlan({
        user: userid,
        plans: [
          {
            title: "Starter",
            short_description: starter_short_description,
            price: starter_charge,
            services: starter_services,
          },
          {
            title: "Avancé",
            short_description: advanced_short_description,
            price: advanced_charge,
            services: advanced_services,
          },
          {
            title: "Premium",
            short_description: premium_short_description,
            price: premium_charge,
            services: premium_services,
          },
        ],
      });

      await newMentorshipPlan.save();

      return NextResponse.json(
        {
          success: true,
          message: "Mentorship plans created successfully",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
