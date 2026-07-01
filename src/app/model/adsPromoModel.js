import mongoose from "mongoose";


const promoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    buttonLink: { type: String, required: true },
    buttonText: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },

}, { timestamps: true })

export default mongoose.models.Promo || mongoose.model('Promo', promoSchema)