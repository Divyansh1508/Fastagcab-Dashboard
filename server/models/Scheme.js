import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  category: {
    type: String,
    default: 'general'
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date
  },
  maxRedemptions: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Scheme', schemeSchema);