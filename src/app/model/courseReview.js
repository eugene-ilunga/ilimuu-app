import { Schema, model, models } from "mongoose";

const courseReviewSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

const CourseReview =
  models.CourseReview || model("CourseReview", courseReviewSchema);
export default CourseReview;
