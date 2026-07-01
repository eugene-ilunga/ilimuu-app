import {Schema,model,models} from 'mongoose';

const BannerSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    typeValue: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default models.Banner || model('Banner', BannerSchema);
