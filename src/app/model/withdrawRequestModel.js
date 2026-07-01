import {model,models,Schema} from 'mongoose';

const AccountDetailsSchema = new Schema(
  {
    type: { type: String, required: true, trim: true }, // e.g., 'bank', 'paypal'
    details: { type: Map, of: String, required: true }, // Dynamic key-value storage
  },
  { _id: false }
);
const WithdrawRequestSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
    },
    accountDetails: {
      type: AccountDetailsSchema,
      required: [true, "Account details are required"],
    },
    status: {
      type: String,
      enum: ['En attente', 'Approuvé', 'Rejeté', 'En cours', 'Terminé','Échoué','Annulé'],
      default: 'En attente',
    },
    transactionId: {
      type: String,
      default: null, // To be populated when the request is processed
    },
    adminNote: {
      type: String,
      maxlength: 500,
      default: '',
    },
    userBalanceBefore: {
      type: Number,
    
    },
    userBalanceAfter: {
      type: Number,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    requestIP: {
      type: String,
      default: '',
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Admin user who processed the request
      default: null,
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
      default: '',
    },
    remarks: {
      type: String,
      maxlength: 500,
      default: '',
    },


  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default models.WithdrawRequest || model('WithdrawRequest', WithdrawRequestSchema);
