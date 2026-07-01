import { Schema, model, models } from "mongoose";

const ReferralSchema = new Schema({
  referrer: { type: Schema.Types.ObjectId, ref: "User" }, // Who referred
  referred: { type: Schema.Types.ObjectId, ref: "User" },
  rewards: { type: Number, default: 0 }, // Reward points
  // Who was referred
}, { timestamps: true, versionKey: false    });

export default models.Referral || model("Referral", ReferralSchema);
