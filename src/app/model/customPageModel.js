// models/customPageModel.js
import { Schema, model, models } from 'mongoose';

const customPageSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  showInFooter: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  metaDescription: {
    type: String,
    default: '',
  },
  metaKeywords: {
    type: String,
    default: '',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const CustomPage = models.CustomPage || model('CustomPage', customPageSchema);
export default CustomPage;

