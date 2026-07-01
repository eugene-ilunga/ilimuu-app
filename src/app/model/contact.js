
const { default: mongoose } = require("mongoose");

const contactSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'name is required'],
    trim: true,
  },
  email:{
    type: String,
    required: [true, 'email is required0'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone:{
    type: String,
    required: [true, 'phone is required'],
    trim: true,
  },
  message:{
    type: String,
    trim: true,
  },
},{Timestamp:true, versionKey:false}
);

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;