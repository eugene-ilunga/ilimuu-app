import { NextResponse } from "next/server";
import MentorshipPlan from "@/app/model/mentorshipPlanModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";

export async function POST(req, res) {
  const formData = await req.formData();
  const cookiesStore = await cookies();
  const userid = formData.get("user_id") || cookiesStore.get("user_id")?.value;

  try {
    await connectToDB();
    const data = await MentorshipPlan.findOne({ user: userid });

    if (data) {
      const starterPlan = data.plans.find((plan) => plan.title === "Starter");
      const advancedPlan = data.plans.find((plan) => plan.title === "Avancé");
      const premiumPlan = data.plans.find((plan) => plan.title === "Premium");

      return NextResponse.json({
        status: 200,
        message: "Mentorship plan",
        id: data._id,
        userid,
        starterPlan,
        advancedPlan,
        premiumPlan,
      });
    }
    return NextResponse.json({
      status: 404,
      message: "No mentorship plan",
      id: null,
      userid,
      starterPlan: null,
      advancedPlan: null,
      premiumPlan: null,
    });
  } catch (error) {
    console.log(error);
  }
}
