import { NextResponse } from "next/server";
import payoutAccountModel from "@/app/model/payoutAccountModel";
import { connectToDB } from "@/utils/database";
import { cookies } from "next/headers";

export async function POST(req) {
    const formData = await req.formData();
    const cookiesStore = await cookies();
    const userId = formData.get("userId") || cookiesStore.get("user_id")?.value;

    console.log("userId", userId);
    try {
        await connectToDB();
        const payoutAccounts = await payoutAccountModel.find({ user: userId }).sort({ createdAt: -1 });

        if (!payoutAccounts || payoutAccounts.length === 0) {
            return NextResponse.json({ status: 200, error: "No payout account found" });
        }


        return NextResponse.json({ status: 200, payoutAccounts: payoutAccounts });
    } catch (error) {
        return NextResponse.json({ status: 500, error: error.message });
    }
}
