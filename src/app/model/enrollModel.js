
import { Schema, model,models } from "mongoose";


 const enrollSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        required: [true, "Courseid is required"],
        ref: "course",
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "Userid is required"],
        ref: "User",
    },
    instructor: {
        type: Schema.Types.ObjectId,
        required: [true, "Instructorid is required"],
        ref: "User",
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    paymentId: {
        type: String,
        required: [true, "Payment ID is required"],
    },

    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
    
},{timestamps: true, versionKey:false});

const Enroll = models.Enroll || model("Enroll", enrollSchema);

export default Enroll;
