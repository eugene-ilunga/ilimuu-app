import { Schema,model,models } from "mongoose";

const mentorReviewSchema = new Schema({
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
},{timestamps: true, versionKey:false});

const MentorReview = models.MentorReview || model("MentorReview", mentorReviewSchema);

export default MentorReview;