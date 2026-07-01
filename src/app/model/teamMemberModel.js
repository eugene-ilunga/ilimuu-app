// models/teamMemberModel.js
import { Schema, model, models } from 'mongoose';

const teamMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/assets/placeholder.jpg',
  },
  bio: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  // Social Media Links
  facebookLink: {
    type: String,
    default: '',
  },
  linkedinLink: {
    type: String,
    default: '',
  },
  twitterLink: {
    type: String,
    default: '',
  },
  instagramLink: {
    type: String,
    default: '',
  },
  // Order for display
  displayOrder: {
    type: Number,
    default: 0,
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const TeamMember = models.TeamMember || model('TeamMember', teamMemberSchema);
export default TeamMember;

