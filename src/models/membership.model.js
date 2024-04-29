import mongoose, { Schema } from 'mongoose';

const membershipSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['free', 'basic', 'exclusive'],
      default: 'free',
    },
    price: {
      type: Number,
    },
    duration: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
  },
  {
    timestamps: true,
  }
);

export const Membership = mongoose.model('Membership', membershipSchema);
