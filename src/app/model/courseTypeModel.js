import { Schema,model,models } from "mongoose";

const courseTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
},{timestamps: true, versionKey:false});

const CourseType = models.CourseType || model("CourseType", courseTypeSchema);

export default CourseType;
