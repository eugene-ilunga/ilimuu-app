import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Optional if targeting a specific group
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },

  type: {
    type: String,
    enum: ['CoursePurchase', 'BookMentorShip', 'Referral', 'AdminNotification', 'Broadcast', 'Other', 'WithdrawalRequest', 'PaymentRequest','BootcampEnrollment'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  broadcast: {
    type: Boolean,
    default: false,
  },
  actionLink: {
    type: String,
  },
  scheduledFor: {
    type: Date,
    default: null,
  },
  targetConditions: {
    type: Object, // Define dynamic filters for targeting users
    default: {},
  },
  userGroup: {
    type: String, // Target specific user groups
    enum: ['all', 'students', 'mentors', 'newStudents', 'newMentors'],
    default: 'all',
  },
}, { timestamps: true, versionKey: false });


const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
