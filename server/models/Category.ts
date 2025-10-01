import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: {
    url?: string;
    publicId?: string;
    altText?: string;
  };
  parent?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  sortOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  children: mongoose.Types.ObjectId[];
  productCount: number;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: '🏷️'
  },
  image: {
    url: String,
    publicId: String,
    altText: String
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (slug index is automatic due to unique: true)
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1 });

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(this: ICategory, next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model<ICategory>('Category', categorySchema);