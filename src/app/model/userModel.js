import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      // match: [/^(?=.{2,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 2-30 alphanumeric letters!"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email invalid"],
      unique: [true, "Email already exists"],
    },
    phone: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password invalid, it should contain at least 6 characters, 1 letter and 1 number!"]
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin", "user"],
      default: "user",
    },
    profession: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    expartise: {
      type: [String],
      default: [],
    },
    language: {
      type: [String],
      default: [],
    },
    certificate: {
      type: [String],
      default: [],
    },
    review: {
      type: [Schema.Types.ObjectId],
      ref: "MentorReview",
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    authType: {
      type: String,
      enum: ["manual", "google", "facebook"],
      default: "manual",
    },

    deviceToken: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    isBanfromPosting:
    {
      type: Boolean,
      default: false,
    },

    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },

    referralCode: { type: String, unique: true }, // Auto-generated
    referredBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to referrer
    rewards: { type: Number, default: 0 }, // Reward points
  },
  { timestamps: true, versionKey: false }
);

const User = models.User || model("User", userSchema);

export default User;

// Given the email user.name@example.co.uk:

// ^[\w-\.]+ matches user.name.
// @ matches the "@" character.
// ([\w-]+\.)+ matches example. and co..
// [\w-]{2,4}$ matches uk.
// Summary
// The regular expression ensures that an email:

// Starts with alphanumeric characters, underscores, hyphens, or dots.
// Has an "@" character.
// Followed by one or more domain parts (each consisting of alphanumeric characters or hyphens, followed by a dot).
// Ends with a top-level domain of 2 to 4 characters.
// If the input matches this pattern, it is considered a valid email. If not, it will show the error message "Email invalid".
