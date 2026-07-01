import { Schema, model, models } from "mongoose";

const checkoutMentorPlanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    plan: {
      type: Schema.Types.ObjectId,
      ref: "MentorshipPlan",
      required: true,
    },

    package :{
      type: Schema.Types.ObjectId,
      required: true,
    },
    
    totalAmount: {
      type: Number,
      required: true,
    },
     amount: Number, // after commission
    commission: Number, // admin cut
    platformFee:Number, // platform fee
    tax: Number, // tax amount

    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    currency: {
      type: String,
    },
    invoiceId: {
      type: String,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
      // New fields for dynamic holding period
      releasedForWithdrawal: {
        type: Boolean,
        default: false,
      },
      holdingPeriod: {
        type: Number, // in days (e.g., 3, 5, 7 days)
        default: 7, // default to 7 days if not specified
      },
      releaseDate: {
        type: Date,
        default: function () {
          return new Date(Date.now() + this.holdingPeriod * 24 * 60 * 60 * 1000);
        },
      },
  },
  { timestamps: true, versionKey: false }
);

const CheckoutPlan = models.CheckoutPlan || model("CheckoutPlan", checkoutMentorPlanSchema);

export default CheckoutPlan;
