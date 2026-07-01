import { Schema, model, models } from "mongoose";

const paymentMethodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    codeName: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
    },
    image: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    },{ timestamps: true, versionKey: false});


const PaymentMethod = models.PaymentMethod || model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
