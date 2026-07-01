// models/mobileAppModel.js
import { Schema, model, models } from 'mongoose';

const mobileAppSchema = new Schema({
  // Hero Section
  heroTitle: {
    type: String,
    default: 'Learn anytime anywhere with our powerful mobile learning app.',
  },
  heroDescription: {
    type: String,
    default: 'Access all your courses, track progress, and learn on the go with our mobile app built for students and instructors alike.',
  },
  downloadButtonText: {
    type: String,
    default: 'Download the App',
  },
  downloadLink: {
    type: String,
    default: '',
  },
  qrCodeImage: {
    type: String,
    default: '/assets/custom-image/qr-code.png',
  },
  showQRCode: {
    type: Boolean,
    default: true,
  },

  // Features/Sections
  features: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }],

  // Meta Information
  metaTitle: {
    type: String,
    default: 'Mobile App - ELIMUU',
  },
  metaDescription: {
    type: String,
    default: 'Download the ELIMUU mobile app and learn on the go.',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const MobileApp = models.MobileApp || model('MobileApp', mobileAppSchema);
export default MobileApp;

