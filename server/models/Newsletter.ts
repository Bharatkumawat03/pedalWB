import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
