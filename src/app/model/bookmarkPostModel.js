import { Schema, model, models } from "mongoose";

const bookmarkPostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User who bookmarked
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post being bookmarked
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const BookmarkPost = models.BookmarkPost || model("BookmarkPost", bookmarkPostSchema);

export default BookmarkPost;
