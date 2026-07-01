import { Schema, model, models } from "mongoose";

const bootcampMCQSchema = new Schema(
  {
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: [true, "Bootcamp is required"],
    },
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for better query performance
bootcampMCQSchema.index({ bootcamp: 1, isActive: 1 });
bootcampMCQSchema.index({ createdBy: 1 });

const BootcampMCQ = models.BootcampMCQ || model("BootcampMCQ", bootcampMCQSchema);

export default BootcampMCQ;

