// models/aboutPageModel.js
import { Schema, model, models } from 'mongoose';

const aboutPageSchema = new Schema({
  // Hero Section
  bannerImage: {
    type: String,
    default: '/assets/custom-image/BannerImageAboutPage.jpg',
  },
  subheading: {
    type: String,
    default: 'About us',
  },
  mainHeading: {
    type: String,
    default: 'About Our Company',
  },
  description: {
    type: String,
    default: 'ELIMUU is a comprehensive online platform that connects students with their favorite mentors and offers a wide range of skill-enhancing courses. Whether you\'re looking to learn a new skill or enhance your current knowledge, ELIMUU provides top-quality courses uploaded by experienced mentors. Join today to start your journey toward success.',
  },
  
  // Team Section
  teamSectionTitle: {
    type: String,
    default: 'Our Team',
  },
  showTeamSection: {
    type: Boolean,
    default: true,
  },

  // Mission Section
  showMissionSection: {
    type: Boolean,
    default: false,
  },
  missionTitle: {
    type: String,
    default: 'Our Mission',
  },
  missionDescription: {
    type: String,
    default: '',
  },

  // Vision Section
  showVisionSection: {
    type: Boolean,
    default: false,
  },
  visionTitle: {
    type: String,
    default: 'Our Vision',
  },
  visionDescription: {
    type: String,
    default: '',
  },

  // Values Section
  showValuesSection: {
    type: Boolean,
    default: false,
  },
  valuesTitle: {
    type: String,
    default: 'Our Values',
  },
  values: [{
    title: String,
    description: String,
    icon: String,
  }],

  // Statistics Section
  showStatsSection: {
    type: Boolean,
    default: false,
  },
  stats: [{
    label: String,
    value: String,
    icon: String,
  }],

  // Meta Information
  metaTitle: {
    type: String,
    default: 'About Us - ELIMUU',
  },
  metaDescription: {
    type: String,
    default: 'Learn more about ELIMUU and our mission to connect students with quality education.',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const AboutPage = models.AboutPage || model('AboutPage', aboutPageSchema);
export default AboutPage;

