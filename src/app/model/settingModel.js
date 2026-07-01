// models/settingsModel.js
import { Schema, model, models } from 'mongoose';

const settingsSchema = new Schema({
  // General Platform Settings
  platformName: {
    type: String,
    default: 'My Platform',
  },
  platformCurrency: {
    type: String,
    default: 'USD', // Default currency
  },

  // Minimum Withdrawal Settings
  minimumWithdrawalAmount: {
    type: Number,
    required: true,
    default: 10, // Minimum amount in dollars
  },

  // Commission Rates for Instructors
  courseCommissionRate: {
    type: Number,
    required: true,
    default: 20, // Default is 20% commission
  },
  mentorshipCommissionRate: {
    type: Number,
    required: true,
    default: 15, // Default is 15% commission for mentorship
  },

  // Referral Program Settings
  enableReferralProgram: {
    type: Boolean,
    default: false,
  },
  referralBonus: {
    type: Number,
    default: 0, // Bonus in dollars for each successful referral
  },

  // Payout Settings
  payoutMethods: {
    type: [String],
    enum: ['Compte bancaire', 'PayPal', 'UPI', 'Stripe', 'Payoneer', 'Bkash', 'Rocket'],
    default: ['Compte bancaire', 'PayPal', 'Stripe'], // Default payout methods
  },
  payoutProcessingTime: {
    type: Number,
    default: 7, // Days to process payout requests
  },

  // Course Settings
  courseApprovalRequired: {
    type: Boolean,
    default: true, // Whether admin approval is needed for courses
  },
  maxCoursePrice: {
    type: Number,
    default: 500, // Maximum course price in dollars
  },
  minCoursePrice: {
    type: Number,
    default: 10, // Minimum course price in dollars
  },

  // Mentorship Settings
  enableMentorshipPlans: {
    type: Boolean,
    default: true,
  },
  maxMentorshipPrice: {
    type: Number,
    default: 1000, // Maximum mentorship price in dollars
  },

  // Tax and Fees
  platformServiceFee: {
    type: Number,
    default: 5, // Service fee in percentage
  },
  enableTaxDeduction: {
    type: Boolean,
    default: false,
  },
  taxRate: {
    type: Number,
    default: 0, // Tax rate in percentage
  },

  // Notification Settings
  enableEmailNotifications: {
    type: Boolean,
    default: true,
  },
  enableSMSNotifications: {
    type: Boolean,
    default: false,
  },

  // Support Settings
  supportEmail: {
    type: String,
    default: 'support@myplatform.com',
  },
  supportPhone: {
    type: String,
    default: '+1234567890',
  },
  supportAddress: {
    type: String,
    default: '123 Main Street, City, Country',
  },

  // Social Media Links
  facebookLink: {
    type: String,
    default: '',
  },
  instagramLink: {
    type: String,
    default: '',
  },
  linkedinLink: {
    type: String,
    default: '',
  },
  youtubeLink: {
    type: String,
    default: '',
  },
  twitterLink: {
    type: String,
    default: '',
  },

  // Miscellaneous
  maintenanceMode: {
    type: Boolean,
    default: false, // Set true for maintenance mode
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently undergoing maintenance. Please check back later.',
  },
  
  // Chatbot Settings
  enableChatbot: {
    type: Boolean,
    default: true, // Enable chatbot by default
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Settings = models.Settings || model('Paramètres', settingsSchema);
export default Settings;
