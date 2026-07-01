// models/videoSectionModel.js
import { Schema, model, models } from 'mongoose';

const videoSectionSchema = new Schema({
  badge: {
    type: String,
    default: 'Our about us',
  },
  title: {
    type: String,
    required: true,
    default: '🎉 40% OFF for the First 100 Customers!',
  },
  description: {
    type: String,
    required: true,
    default: 'Be among the first 100 to grab this exclusive deal and save 40% on your purchase. Don\'t miss out—once the slots are gone, the offer ends! 🚀',
  },
  videoUrl: {
    type: String,
    required: true,
    default: 'https://youtu.be/6lwh_jfLn2g',
  },
  button1Text: {
    type: String,
    default: 'Join With Us',
  },
  button1Link: {
    type: String,
    default: '/about',
  },
  button2Text: {
    type: String,
    default: 'Our Courses',
  },
  button2Link: {
    type: String,
    default: '/courselist',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const VideoSection = models.VideoSection || model('VideoSection', videoSectionSchema);
export default VideoSection;

