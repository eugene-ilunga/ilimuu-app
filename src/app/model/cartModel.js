import { Schema, model, models } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: "course",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

  
  },
  { timestamps: true, versionKey: false }
);

const Cart = models.Cart || model("Panier", cartSchema);

export default Cart;
