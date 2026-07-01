import { Schema, model, models } from "mongoose";

const checkoutBootcampSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    amount: Number, // after commission
    commission: Number, // admin cut
    platform_fee: Number, // platform fee
    tax: Number, // tax amount
    payment_method: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed", "Refunded"],
      required: true,
      default: "pending",
    },
    payment_id: {
      type: String,
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    currency: {
      type: String,
      default: "USD",
    },
    invoice_id: {
      type: String,
    },
    // Bootcamp-specific payment fields
    payment_plan: {
      type: String,
      enum: ["full", "installment"],
      default: "full",
    },
    installment_details: {
      total_installments: {
        type: Number,
        default: 1,
      },
      paid_installments: {
        type: Number,
        default: 0,
      },
      installment_amount: {
        type: Number,
      },
      next_payment_date: {
        type: Date,
      },
    },
    // New fields for dynamic holding period
    released_for_withdrawal: {
      type: Boolean,
      default: false,
    },
    holding_period: {
      type: Number, // in days (e.g., 7, 14, 30 days for bootcamps)
      default: 14, // default to 14 days for bootcamps
    },
    release_date: {
      type: Date,
      default: function () {
        return new Date(Date.now() + this.holding_period * 24 * 60 * 60 * 1000);
      },
    },
    refund_policy: {
      refundable_until: {
        type: Date,
      },
      refund_percentage: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
    },
    application_fee_paid: {
      type: Boolean,
      default: false,
    },
    enrollment_confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for better query performance
checkoutBootcampSchema.index({ user: 1, payment_status: 1 });
checkoutBootcampSchema.index({ bootcamp: 1 });
checkoutBootcampSchema.index({ payment_date: -1 });

const CheckoutBootcamp = models.CheckoutBootcamp || model("CheckoutBootcamp", checkoutBootcampSchema);

export default CheckoutBootcamp;
