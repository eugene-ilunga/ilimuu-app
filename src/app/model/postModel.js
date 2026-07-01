
import { Schema } from "mongoose";

const { default: mongoose } = require("mongoose");


const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    replies: [replySchema],
  },
  { timestamps: true, versionKey: false }
);
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model who posted it
      required: true,
    },
    title: {
      type: String,
      default: "",
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: [String], // URL to the image stored on a cloud service like Cloudinary
      default: [],
      required: false,
    },
    video: {
      type: String, // URL to the video stored on a cloud service like Cloudinary
      default: "",
      required: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    shares: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    //uition, job, mentorship, live courses,
    type: {
      type: Schema.Types.ObjectId,
      ref: "PostType",
    },

    isBanner: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true, versionKey: false }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
