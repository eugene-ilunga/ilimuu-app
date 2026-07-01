import { Schema, model, models } from "mongoose";

const enrollCourseSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0, // percentage completed
    },
    lecturesProgress: [
      {
        lectureId: {
          type: Schema.Types.ObjectId,
          ref: "Lecture",
        },
        watchedPercentage: {
          type: Number,
          default: 0, // Percentage watched for this lecture
        },
        lastWatched: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastWatched: {
      type: Number,
      default: 0, // Last watched lecture index
    },
    lastAccessed: {
      type: Date, 
    },
    completed: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default:null,
    },
  },
  { timestamps: true, versionKey: false }
);

const EnrollCourse =
  models.EnrollCourse || model("EnrollCourse", enrollCourseSchema);

export default EnrollCourse;
