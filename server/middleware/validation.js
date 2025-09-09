const Joi = require('joi');

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// User validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(30).required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 30 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string().trim().min(2).max(30).required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 30 characters',
      'any.required': 'Last name is required'
    }),
  email: Joi.string().email().lowercase().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(6).max(128).required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'any.required': 'Password is required'
    }),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Product validation schemas
const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  price: Joi.number().min(0).required(),
  originalPrice: Joi.number().min(0).optional(),
  category: Joi.string().valid(
    'bikes', 'drivetrain', 'wheels', 'brakes', 'components', 
    'accessories', 'apparel', 'electronics', 'maintenance', 'safety'
  ).required(),
  brand: Joi.string().trim().required(),
  features: Joi.array().items(Joi.string().max(200)).optional(),
  specifications: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  colors: Joi.array().items(Joi.string()).optional(),
  sizes: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isNew: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().trim().min(3).max(100).required(),
  comment: Joi.string().trim().min(10).max(1000).required()
});

// Address validation schema
const addressSchema = Joi.object({
  type: Joi.string().valid('home', 'office', 'other').optional(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  addressLine1: Joi.string().trim().required(),
  addressLine2: Joi.string().trim().optional(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
  country: Joi.string().trim().default('India'),
  phone: Joi.string().optional(),
  isDefault: Joi.boolean().optional()
});

// Order validation schema
const orderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    selectedColor: Joi.string().optional(),
    selectedSize: Joi.string().optional()
  })).min(1).required(),
  shippingAddress: addressSchema.required(),
  billingAddress: addressSchema.optional(),
  paymentMethod: Joi.string().valid(
    'credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod'
  ).required(),
  couponCode: Joi.string().optional(),
  loyaltyPointsUsed: Joi.number().min(0).optional(),
  notes: Joi.string().max(500).optional()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  productSchema,
  reviewSchema,
  addressSchema,
  orderSchema
};