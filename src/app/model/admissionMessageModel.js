
const { default: mongoose } = require("mongoose");


const admissionMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        lowarecase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
        trim: true,
    },
    courseName:{
        type: String,
        required: [true, 'course name is required'],
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    }
},
{ timestamps: true, versionKey: false}
)

const AdmissionMessage = mongoose.models.AdmissionMessage || mongoose.model('AdmissionMessage', admissionMessageSchema);

export default AdmissionMessage;
