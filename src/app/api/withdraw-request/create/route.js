import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import WithdrawRequest from "@/app/model/withdrawRequestModel";
import PayoutAccount from "@/app/model/payoutAccountModel";
import Earnings from "@/app/model/earningModel";
import Settings from "@/app/model/settingModel";
import User from "@/app/model/userModel"; // ✅ Missing import
import Notification from "@/app/model/notificationModel";
import { generateTransactionId } from "@/utils/generateInvoiceID";
import { cookies } from "next/headers";

// Helpers
const errorResponse = (message, status = 400) =>
  NextResponse.json({ error: message }, { status });

async function createNotification(userId, title, message, data) {
  const notification = new Notification({
    user: userId,
    title,
    type: "WithdrawalRequest",
    message,
    data,
  });
  await notification.save();
}

export async function POST(req) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const cookiesStore = await cookies();

    const userId = formData.get("mentorid") || cookiesStore.get("user_id")?.value;
    
    const payoutAccountId = formData.get("account");
    const amount = parseFloat(formData.get("amount"));
    const requestIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "Unknown";

    // Validate fields
    if (!userId || !payoutAccountId || isNaN(amount) || amount <= 0) {
      return errorResponse("Invalid request. Please check your inputs.");
    }

    // Minimum withdrawal amount
    const settings = await Settings.findOne();
    const MIN_WITHDRAWAL = settings?.minimumWithdrawalAmount || 10;

    if (amount < MIN_WITHDRAWAL) {
      return errorResponse(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
    }

    // Check balance (atomic update prevents race conditions)
    const earnings = await Earnings.findOneAndUpdate(
      { user: userId, availableBalance: { $gte: amount } },
      { $inc: { availableBalance: -amount } },
      { new: true }
    );

    if (!earnings) {
      return errorResponse("Insufficient balance");
    }

    // Verify payout account
    const payoutAccount = await PayoutAccount.findOne({
      _id: payoutAccountId,
      user: userId,
    });

    if (!payoutAccount) {
      return errorResponse("Invalid payout account");
    }

    const accountDetails = payoutAccount.accountDetails || {};

    // Create withdrawal request
    const withdrawRequest = new WithdrawRequest({
      user: userId,
      amount,
      accountDetails,
      userBalanceBefore: earnings.availableBalance + amount, // since already deducted
      userBalanceAfter: earnings.availableBalance,
      requestIP,
      transactionId: generateTransactionId(),
    });

    await withdrawRequest.save();

    // Send notifications
    const admin = await User.findOne({ role: "admin" });
    const user = await User.findById(userId);
    if (admin) {
      await createNotification(
        admin._id,
        "New Withdrawal Request",
        `New withdrawal request of $${amount} from ${user.name}.`,
        withdrawRequest
      );
    }

    await createNotification(
      userId,
      "Withdrawal Request Submitted",
      `Your withdrawal request of $${amount} has been successfully created.`,
      withdrawRequest
    );

    return NextResponse.json({
      status: 201,
      message: "Withdrawal request created successfully",
      withdrawRequest,
    });
  } catch (error) {
    console.error("Withdrawal Request Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
