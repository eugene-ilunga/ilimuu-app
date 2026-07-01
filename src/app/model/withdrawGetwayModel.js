import { Schema, model, models } from "mongoose";

const WithdrawGatewaySchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., 'Compte bancaire', 'PayPal'
    requiredFields: [
      {
        fieldName: { type: String, required: true }, // Name of the field, e.g., 'Account Number'
        fieldType: {
          type: String,
          required: true,
          enum: ["string", "number", "boolean", "date"], // Specify allowed types
        },
      },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true, versionKey: false }
);

export default models.WithdrawGateway ||
  model("WithdrawGateway", WithdrawGatewaySchema);
