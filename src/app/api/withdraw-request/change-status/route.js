import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import WithdrawRequest from "@/app/model/withdrawRequestModel";
import { cookies } from "next/headers";
import Transaction from "@/app/model/transactionModel";
import { generateTransactionId } from "@/utils/generateInvoiceID";

export async  function POST(req, res) {
    const formData = await req.formData();
    const requestId = formData.get("requestId"); 
    const status = formData.get("status");
    const remarks = formData.get("remarks");
    const rejectionReason = formData.get("rejectionReason");
    const cookiesStore = await cookies();
    const processedBy =   cookiesStore.get("user_id")?.value; // Admin user who processed the request

    try {
        await connectToDB();
        const withdrawRequest = await WithdrawRequest.findOne({ _id: requestId
         });
         console.log("Withdraw Request:", withdrawRequest); // Debugging line
        if (!withdrawRequest) {
            return NextResponse.json({ status:404, message: "Request not found" });
        }

        withdrawRequest.status = status;
        withdrawRequest.remarks = remarks;
        withdrawRequest.rejectionReason = rejectionReason;
        withdrawRequest.processedBy = processedBy;

        await withdrawRequest.save();

        if (status === "completed") {
            // Create a transaction record for the approved request
            const transaction = new Transaction({
                transactionId: generateTransactionId(),
                user: withdrawRequest.user,
                amount: withdrawRequest.amount,
                type: "withdrawal",
                status: "completed",
                description: `Withdrawal request approved. Amount: ${withdrawRequest.amount}`,
                paymentMethod: withdrawRequest.accountDetails.type,
            });
            await transaction.save();
        }

        //create notification for user
        const userNotification = new Notification({
            user: withdrawRequest.user,
            title: "Withdrawal Request Status Updated",
            type: "WithdrawalRequest",
            message: `Your withdrawal request of $${withdrawRequest.amount} has been ${status.toLowerCase()}.`,
            data: withdrawRequest,
        });
        await userNotification.save();

        return NextResponse.json({status:200, message: "Request approved successfully" });
    }
    catch (error) {
        console.log(error.message);
        return NextResponse.json({status:500, message: error.message });
    }

    

}