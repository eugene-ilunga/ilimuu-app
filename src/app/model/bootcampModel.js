import { Schema, model, models } from "mongoose";

const bootcampSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Bootcamp name is required"],
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
      required: [true, "Overview video is required"],
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
    // Bootcamp-specific fields
    duration_weeks: {
      type: Number,
      required: [true, "Duration in weeks is required"],
      min: 4, // Minimum 4 weeks for a bootcamp
    },
    start_date: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "End date is required"],
    },
    application_deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    co_instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all level"],
      default: "all level",
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    max_students: {
      type: Number,
      required: [true, "Maximum students is required"],
      min: 5,
      max: 100,
    },
    enrolled_students: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        enrollment_date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["applied", "accepted", "rejected", "completed", "dropped"],
          default: "applied",
        },
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
    bootcamp_tags: {
      type: [String],
      default: [],
    },
    // Bootcamp curriculum phases
    phases: [
      {
        phase_number: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        duration_weeks: {
          type: Number,
          required: true,
        },
        learning_objectives: [String],
        projects: [
          {
            title: String,
            description: String,
            due_date: Date,
          },
        ],
      },
    ],
    schedule: {
      days_per_week: {
        type: Number,
        required: [true, "Days per week is required"],
        min: 3,
        max: 7,
      },
      hours_per_day: {
        type: Number,
        required: [true, "Hours per day is required"],
        min: 2,
        max: 8,
      },
      class_times: [
        {
          day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
            required: true,
          },
          start_time: {
            type: String,
            required: true,
          },
          end_time: {
            type: String,
            required: true,
          },
        },
      ],
      break_times: [
        {
          start_time: {
            type: String,
            required: true,
          },
          end_time: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],
      timezone: {
        type: String,
        default: "UTC",
      },
    },
    bootcamp_type: {
      type: String,
      enum: ["full-time", "part-time", "weekend", "online", "hybrid"],
      required: [true, "Bootcamp type is required"],
    },
    seo_tags: {
      seo_metadata: {
        type: String,
        default: "",
      },
      seo_description: {
        type: String,
        default: "",
      },
    },
    certification: {
      type: Boolean,
      default: true, // Most bootcamps provide certification
    },
    bootcamp_includes: {
      type: [String],
      default: [
        "Live sessions",
        "Project assignments",
        "Mentor support",
        "Career guidance",
        "Certificate of completion",
      ],
    },
    bootcamp_badge: {
      type: String,
      enum: ["bestseller", "toprated", "new", "trending", "intensive"],
      default: "new",
    },
    career_support: {
      job_placement_assistance: {
        type: Boolean,
        default: false,
      },
      resume_review: {
        type: Boolean,
        default: false,
      },
      interview_preparation: {
        type: Boolean,
        default: false,
      },
      portfolio_building: {
        type: Boolean,
        default: false,
      },
      networking_events: {
        type: Boolean,
        default: false,
      },
      mentorship_program: {
        type: Boolean,
        default: false,
      },
      career_counseling: {
        type: Boolean,
        default: false,
      },
      industry_connections: {
        type: Boolean,
        default: false,
      },
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    tools_and_technologies: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "active", "completed", "cancelled"],
      default: "draft",
    },
    cohort_number: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for better query performance
bootcampSchema.index({ start_date: 1, status: 1 });
bootcampSchema.index({ category: 1, bootcamp_type: 1 });
bootcampSchema.index({ instructor: 1 });

const Bootcamp = models.Bootcamp || model("Bootcamp", bootcampSchema);

export default Bootcamp;
