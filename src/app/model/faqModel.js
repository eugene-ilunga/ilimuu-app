// models/faqModel.js
import { Schema, model, models } from 'mongoose';

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Général',
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

const FAQ = models.FAQ || model('FAQ', faqSchema);
export default FAQ;

