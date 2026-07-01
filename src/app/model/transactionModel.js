import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required:  true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["purchase", "referal", "refund", "withdrawal", "deposit"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
   
  },
  { timestamps: true, versionKey: false }
);

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
