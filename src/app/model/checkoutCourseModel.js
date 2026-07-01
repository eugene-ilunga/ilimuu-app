import { Schema, model, models } from "mongoose";

const checkoutCourseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
        required: true,
      },
    ],

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
    // Billing Address Fields
    billingAddress: {
      firstName: {
        type: String,
        default: null,
      },
      lastName: {
        type: String,
        default: null,
      },
      company: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      zipCode: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const CheckoutCourse =
  models.CheckoutCourse || model("CheckoutCourse", checkoutCourseSchema);

export default CheckoutCourse;
