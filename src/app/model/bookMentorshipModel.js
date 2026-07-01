import { Schema,model,models } from "mongoose";

const BookedMentorshipSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mentor:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan:{
        type: Schema.Types.ObjectId,
        ref: "MentorshipPlan",
        required: true,
    },
    package:{
        type: Schema.Types.ObjectId,
        ref: "MentorshipPlan",
        required: true,
    },
    purchaseDate:{
        type: Date,
        default: Date.now,
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },

},{timestamps: true, versionKey: false});

const BookedMentorship = models.BookedMentorship || model("BookedMentorship",BookedMentorshipSchema);

export default BookedMentorship;
    