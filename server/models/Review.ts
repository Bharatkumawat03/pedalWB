import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title?: string; // Optional - for ratings without reviews
  comment?: string; // Optional - for ratings without reviews
  verified: boolean;
  helpful: number;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  type: 'rating' | 'review'; // 'rating' = just rating, 'review' = rating + text
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: function(this: IReview) {
      return this.type === 'review';
    },
    maxlength: 100
  },
  comment: {
    type: String,
    required: function(this: IReview) {
      return this.type === 'review';
    },
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['rating', 'review'],
    default: 'review'
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Compound index to ensure one rating/review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);