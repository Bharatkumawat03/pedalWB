import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  description: string;
  logo: string;
  country: string;
  status: 'Active' | 'Inactive';
  tier: 'Standard' | 'Premium' | 'Enterprise';
  website?: string;
  foundedYear?: number;
  productCount: number;
  revenue: number;
  featured: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  socialLinks: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Brand description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    required: [true, 'Brand logo is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    maxlength: [50, 'Country name cannot exceed 50 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  tier: {
    type: String,
    enum: ['Standard', 'Premium', 'Enterprise'],
    default: 'Standard'
  },
  website: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year cannot be before 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  productCount: {
    type: Number,
    default: 0,
    min: [0, 'Product count cannot be negative']
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  contactInfo: {
    email: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    phone: String,
    address: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
brandSchema.index({ name: 1 });
brandSchema.index({ country: 1 });
brandSchema.index({ status: 1 });
brandSchema.index({ tier: 1 });
brandSchema.index({ featured: 1 });
brandSchema.index({ productCount: -1 });
brandSchema.index({ revenue: -1 });

// Generate slug from name before saving
brandSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    
    while (await (this.constructor as any).findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    this.slug = uniqueSlug;
  }
  next();
});

// Static method to update product count for all brands
brandSchema.statics.updateProductCounts = async function() {
  const Product = mongoose.model('Product');
  const brands = await this.find({});
  
  for (const brand of brands) {
    const productCount = await Product.countDocuments({ brand: brand.name });
    await this.updateOne({ _id: brand._id }, { productCount });
  }
};

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
