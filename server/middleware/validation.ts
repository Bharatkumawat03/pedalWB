import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }
    
    next();
  };
};

// User registration schema
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
});

// User login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Product schema
export const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(2000).required(),
  price: Joi.number().min(0).required(),
  originalPrice: Joi.number().min(0).optional(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  features: Joi.array().items(Joi.string().max(200)).optional(),
  colors: Joi.array().items(Joi.string()).optional(),
  sizes: Joi.array().items(Joi.string()).optional()
});

// Category schema
export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(500).optional(),
  icon: Joi.string().optional(),
  parent: Joi.string().optional()
});

export default { validate, registerSchema, loginSchema, productSchema, categorySchema };