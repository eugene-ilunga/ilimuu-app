import { Schema, model, models } from "mongoose";
const earningsSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
      availableBalance: {
        type: Number,
        default: 0,
      },
      pendingBalance: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true, versionKey: false }
  );
  
  const Earnings = models.Earnings || model("Gains", earningsSchema);
  
  export default Earnings;
  