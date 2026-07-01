import { Schema, model, models } from "mongoose";

const enrollBootcampSchema = new Schema(
  {
    bootcampId: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application_date: {
      type: Date,
      default: Date.now,
    },
    enrollment_status: {
      type: String,
      enum: ["pending", "approved", "rejected", "waitlisted", "completed", "dropped","accepted"],
      default: "pending",
    },
    application_data: {
      motivation_letter: {
        type: String,
        required: true,
      },
      experience_level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
      },
      goals: {
        type: String,
        required: true,
      },
      availability: {
        type: String,
        required: true,
      },
      portfolio_url: {
        type: String,
      },
      linkedin_url: {
        type: String,
      },
      github_url: {
        type: String,
      },
    },
    progress: {
      overall_progress: {
        type: Number,
        default: 0, // percentage completed
        min: 0,
        max: 100,
      },
      current_phase: {
        type: Number,
        default: 1,
      },
      phases_progress: [
        {
          phase_number: {
            type: Number,
            required: true,
          },
          completion_percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
          },
          started_date: {
            type: Date,
          },
          completed_date: {
            type: Date,
          },
          projects_completed: [
            {
              project_title: String,
              completion_date: Date,
              grade: {
                type: String,
                enum: ["A", "B", "C", "D", "F", "pending"],
                default: "pending",
              },
              feedback: String,
            },
          ],
        },
      ],
      attendance: {
        total_sessions: {
          type: Number,
          default: 0,
        },
        attended_sessions: {
          type: Number,
          default: 0,
        },
        attendance_percentage: {
          type: Number,
          default: 0,
        },
      },
    },
    last_accessed: {
      type: Date,
      default: Date.now,
    },
    completion_date: {
      type: Date,
    },
    certificate_url: {
      type: String,
      default: null,
    },
    final_grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F", "incomplete"],
    },
    career_outcomes: {
      job_placed: {
        type: Boolean,
        default: false,
      },
      job_title: {
        type: String,
      },
      company_name: {
        type: String,
      },
      salary_range: {
        type: String,
      },
      placement_date: {
        type: Date,
      },
    },
    feedback: {
      bootcamp_rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      instructor_rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      curriculum_rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      support_rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review_text: {
        type: String,
      },
      would_recommend: {
        type: Boolean,
      },
    },
    notes: {
      instructor_notes: {
        type: String,
      },
      student_notes: {
        type: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

// Compound index to ensure unique enrollment per user per bootcamp
enrollBootcampSchema.index({ bootcampId: 1, userId: 1 }, { unique: true });

// Index for better query performance
enrollBootcampSchema.index({ enrollment_status: 1 });
enrollBootcampSchema.index({ application_date: -1 });

const EnrollBootcamp = models.EnrollBootcamp || model("EnrollBootcamp", enrollBootcampSchema);

export default EnrollBootcamp;
