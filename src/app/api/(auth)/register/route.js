import { hash } from "bcryptjs";
import { generateToken } from "../../../../utils/jwt";
import User from "../../../model/userModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";
import { NextResponse } from "next/server";
import Referral from "@/app/model/refferalModel";
import Settings from "@/app/model/settingModel";
import Transaction from "@/app/model/transactionModel";
import { generateReferralCode } from "@/utils/generateInvoiceID";
import { generateTransactionId } from "@/utils/generateInvoiceID";
import Earnings from "@/app/model/earningModel";
import Notification from "@/app/model/notificationModel";

export async function POST(req, res) {
  try {
    // Connect to the database mongodb
    await connectToDB();

    console.log(req);

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const country = formData.get("country");
    const language = formData.get("language");
    const gender = formData.get("gender");
    const password = formData.get("password");
    const image = formData.get("image");
    const role = formData.get("role");
    const referralCode = formData.get("referralCode");
    var expartise = [];
    var profession = "";
    var about = "";
    var hourlyRate = 0;
    if (role === "instructor") {
      expartise = formData.getAll("expartise");
      profession = formData.get("profession");
      about = formData.get("about");
      hourlyRate = formData.get("hourly-rate");
    }

    // Check if the referral code exists
    let referrer;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return NextResponse.json({
          status: 400,
          message: "Invalid referral code.",
        });
      }
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { status: 400, message: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return NextResponse.json(
        { status: 409, message: "Email already exists" },
        { status: 409 }
      );
    }

    const userData = await User.create({
      name,
      email,
      password: hashedPassword,
      image: image,
      role: role,
      expartise: expartise ?? [],
      profession: profession ?? null,
      about: about ?? null,
      phone: phone ?? null,
      country: country ?? null,
      language: language,
      gender: gender ?? null,
      referralCode: generateReferralCode(), // Implement this function
      referredBy: referrer?._id,
      hourlyRate: hourlyRate ?? 0,
    });

    const user = { id: userData._id, email, role: userData.role , password: hashedPassword };

    // Generate JWT
    const token = await generateToken(user);

    // add transaction and referral


    if (referrer) {
      const settings = await Settings.findOne();
      const reward = settings?.referralBonus ?? 0;

      if (settings?.enableReferralProgram) {
        await Referral.create({
          referrer: referrer._id,
          referee: userData._id,
          rewards: reward,
        });

        await Earnings.findOneAndUpdate(
          { user: referrer._id }, // Match the user's earnings record
          {
            $inc: {
              totalEarnings: reward, // Increment total earnings
              availableBalance: reward, // Increment available balance
            },
          },
          {
            upsert: true, // Create a new document if none exists
            new: true, // Return the updated document
            setDefaultsOnInsert: true, // Apply defaults if creating a new document
          }
        );

        await Earnings.findOneAndUpdate(
          { user: userData._id }, // Match the user's earnings record
          {
            $inc: {
              totalEarnings: reward, // Increment total earnings
              availableBalance: reward, // Increment available balance
            },
          },
          {
            upsert: true, // Create a new document if none exists
            new: true, // Return the updated document
            setDefaultsOnInsert: true, // Apply defaults if creating a new document
          }
        );

        await Transaction.create({
          transactionId: generateTransactionId(),
          user: referrer._id,
          amount: reward,
          type: "referal",
          description: "Referral Bonus",
        });

        await Transaction.create({
          transactionId: generateTransactionId(),
          user: userData._id,
          amount: reward,
          type: "referal",
          description: "Referral Bonus",
        });

        await Notification.create({
          user: referrer._id,
          title: "Referral Bonus",
          type: "Referral",
          message: `You have received $${reward} for referring ${name}`,
        });

        await Notification.create({
          user: userData._id,
          title: "Referral Bonus",
          type: "Referral",
          message: `You have received $${reward} for joining with referral code`,
        });
      }
    }

    return NextResponse.json(
      {
        status: 201,
        message: "Register Successfully!",
        userid: userData._id,
        token,
        role,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
