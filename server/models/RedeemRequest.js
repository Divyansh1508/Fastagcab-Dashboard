import mongoose from 'mongoose';

const redeemRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cash', 'gift', 'voucher'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing', 'completed'],
    default: 'pending'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  notes: {
    type: String
  },
  adminNotes: {
    type: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  trackingNumber: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('RedeemRequest', redeemRequestSchema);