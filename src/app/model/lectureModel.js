import { Schema,model,models } from "mongoose";

export const lectureSchema = new Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
    },
    contentType: {
        type: String,
        enum: ["video", "pdf", "both"],
        default: "video",
    },
    videoType:{
        type: String,
    },
    videoUrl: {
        type: String,
    },
    video_public_id: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    pdfUrl: {
        type: String,
    },
    pdf_public_id: {
        type: String,
    },
    summary: {
        type: String,
        
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "course",
    },
    status: {
        type: String,
        enum: ["free", "paid"],
        default: "paid",
    },

},{timestamps: true, versionKey:false});

const Lecture = models.Lecture || model("Lecture", lectureSchema);

export default Lecture;