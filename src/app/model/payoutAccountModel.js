import { model, models, Schema } from "mongoose";

// Dynamic Account Details Schema
const AccountDetailsSchema = new Schema(
  {
    type: { type: String, required: true, trim: true }, // e.g., 'bank', 'paypal'
    details: { type: Map, of: String, required: true }, // Dynamic key-value storage
  },
  { _id: false }
);

const PayoutAccountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    accountType: {
      type: String,
      required: true, // No enum here
    },
    accountDetails: {
      type: AccountDetailsSchema,
      required: [true, "Account details are required"],
    },
   
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

export default models.PayoutAccount || model("PayoutAccount", PayoutAccountSchema);
