import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface IInventory {
  inStock: boolean;
  quantity: number;
  lowStockThreshold: number;
  sku?: string;
}

export interface IShipping {
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  freeShipping: boolean;
  shippingClass?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  category: string;
  brand: string;
  images: IProductImage[];
  features: string[];
  specifications: Map<string, string>;
  colors: string[];
  sizes: string[];
  inventory: IInventory;
  shipping: IShipping;
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  featured: boolean;
  discountedPrice: number;
  isOnSale: boolean;
  isInStock: boolean;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['bikes', 'drivetrain', 'wheels', 'brakes', 'components', 'accessories', 'apparel', 'electronics', 'maintenance', 'safety']
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  features: [{
    type: String,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  specifications: {
    type: Map,
    of: String
  },
  colors: [String],
  sizes: [String],
  inventory: {
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative']
    },
    sku: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (slug index is automatic due to unique: true)
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function(this: IProduct) {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Virtual for sale status
productSchema.virtual('isOnSale').get(function(this: IProduct) {
  return this.discount > 0;
});

// Virtual for stock status
productSchema.virtual('isInStock').get(function(this: IProduct) {
  return this.inventory.inStock && this.inventory.quantity > 0;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('brand')) {
    const productName = `${this.brand} ${this.name}`;
    this.slug = productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model<IProduct>('Product', productSchema);