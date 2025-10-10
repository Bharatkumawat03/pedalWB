import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  type: 'home' | 'office' | 'other';
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  addedAt: Date;
}

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IUserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
}

export interface ISocialAuth {
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatar?: {
    url?: string;
    publicId?: string;
  };
  addresses: IAddress[];
  preferences: IUserPreferences;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  socialAuth?: ISocialAuth;
  cart: ICartItem[];
  wishlist: IWishlistItem[];
  orderHistory: mongoose.Types.ObjectId[];
  loyaltyPoints: number;
  totalSpent: number;
  fullName: string;
  isLocked: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<IUser>;
  resetLoginAttempts(): Promise<IUser>;
  addToCart(productId: string, quantity?: number, selectedColor?: string, selectedSize?: string): Promise<IUser>;
  removeFromCart(cartItemId: string): Promise<IUser>;
  addToWishlist(productId: string): Promise<IUser>;
  removeFromWishlist(productId: string): Promise<IUser>;
}

const addressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  phone: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  avatar: {
    url: String,
    publicId: String
  },
  addresses: [addressSchema],
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  socialAuth: {
    googleId: String,
    facebookId: String,
    twitterId: String
  },
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    selectedColor: String,
    selectedSize: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  orderHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc: any, ret: any) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes (email index is automatic due to unique: true)
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked
userSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function(this: IUser): Promise<IUser> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    }).exec();
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }
  
  return this.updateOne(updates).exec();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function(this: IUser): Promise<IUser> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  }).exec();
};

// Add item to cart
userSchema.methods.addToCart = function(this: IUser, productId: string, quantity = 1, selectedColor?: string, selectedSize?: string): Promise<IUser> {
  const existingItem = this.cart.find(item => 
    item.product.toString() === productId.toString() &&
    item.selectedColor === selectedColor &&
    item.selectedSize === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: new mongoose.Types.ObjectId(productId),
      quantity,
      selectedColor,
      selectedSize,
      addedAt: new Date()
    });
  }

  return this.save();
};

// Remove item from cart
userSchema.methods.removeFromCart = function(this: IUser, cartItemId: string): Promise<IUser> {
  this.cart = this.cart.filter(item => item._id?.toString() !== cartItemId);
  return this.save();
};

// Add item to wishlist
userSchema.methods.addToWishlist = function(this: IUser, productId: string): Promise<IUser> {
  const exists = this.wishlist.find(item => 
    item.product.toString() === productId.toString()
  );

  if (!exists) {
    this.wishlist.push({ 
      product: new mongoose.Types.ObjectId(productId),
      addedAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Remove item from wishlist
userSchema.methods.removeFromWishlist = function(this: IUser, productId: string): Promise<IUser> {
  this.wishlist = this.wishlist.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

export default mongoose.model<IUser>('User', userSchema);