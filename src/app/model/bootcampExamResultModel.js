import { Schema, model, models } from "mongoose";

const bootcampExamResultSchema = new Schema(
  {
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: [true, "Bootcamp is required"],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    answers: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: "BootcampMCQ",
          required: true,
        },
        selectedOption: {
          type: Number, // Index of selected option
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    obtainedPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for better query performance
bootcampExamResultSchema.index({ bootcamp: 1, student: 1 });
bootcampExamResultSchema.index({ student: 1 });
bootcampExamResultSchema.index({ bootcamp: 1 });

const BootcampExamResult = models.BootcampExamResult || model("BootcampExamResult", bootcampExamResultSchema);

export default BootcampExamResult;

