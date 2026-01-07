import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  aiSummary: {
    type: String,
    required: true
  },
  aiRecommendedActions: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, {
  timestamps: true
});


export default mongoose.model('Review', reviewSchema);