import { NextResponse } from "next/server";
import WithdrawGateway from "@/app/model/withdrawGetwayModel";
import { connectToDB } from "@/utils/database";

// toggle withdraw status update

export async function PATCH(req) {
    try {
       const formData = await req.formData();
        const id = formData.get("id");

        await connectToDB();
    
        const existingGateway = await WithdrawGateway.findById(id);

        if (!existingGateway) {
            return NextResponse.json({
                status: 404,
                message: "Withdraw Gateway not found",
            });
        }

        const updatedStatus = existingGateway.status === "active" ? "inactive" : "active";

        existingGateway.status = updatedStatus;
        await existingGateway.save();

        return NextResponse.json({
            status: 200,
            message: "Gateway status updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        return NextResponse.error(error);
    }
}
    