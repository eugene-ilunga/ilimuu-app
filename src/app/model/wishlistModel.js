import { model,models, Schema } from "mongoose";

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "course",
        required: [true, "Course is required"]
    }
}, { timestamps: true, versionKey: false });

export default models.Wishlist || model("Wishlist", wishlistSchema);

