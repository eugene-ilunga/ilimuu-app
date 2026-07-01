import { Schema, model, models } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course name is required"],
    },
    short_description: {
      type: String,
      required: [true, "Short Description is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    overview_video: {
      type: String,
      required: [true, "Overview is required"],
    },
    course_type: {
      type: Schema.Types.ObjectId,
      ref: "CourseType",
      required: [true, "Course Type is required"],
    },
    session_type:{
         type: String,
      required: [true, "Session Type is required"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Catégorie",
      required: [true, "Category is required"],
    },
    subCategory: {
      type: String,
      required: [true, "Sub Category is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      default: "0",
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all level"],
      default: "all level",
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    totalSeat: {
      type: Number,
      default: 0,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    requirements: {
      type: [String],
      default: [],
    },

    outcomes: {
      type: [String],
      default: [],
    },

    courseTags: {
      type: [String],
      default: [],
    },

    expiringMonth: {
      type: Number,
      default: 0,
    },
    seoTags: {
      seoMetadata: {
        type: String,
        default: "",
      },
      seoDescription: {
        type: String,
        default: "",
      },
    },
    cetification: {
      type: Boolean,
      default: false,
    },
    courseIncludes: {
      type: [String],
      default: [],
    },

    courseBadge: {
      type: String,
      enum: ["bestseller", "toprated", "new", "trending"],
      default: "new",
    },

    status: {
      type: String,
      enum: ["pending", "reject", "active", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const Course = models.Course || model("course", courseSchema);

export default Course;
