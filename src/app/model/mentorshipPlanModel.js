import { Schema, model, models } from "mongoose";

const PlanSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    services: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const mentorshipPlanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  plans: [PlanSchema],
}, { timestamps: true, versionKey: false });

const MentorshipPlan =
  models.MentorshipPlan || model("MentorshipPlan", mentorshipPlanSchema);

export default MentorshipPlan;
