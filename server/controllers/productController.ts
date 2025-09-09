import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Filter by brand
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = req.query.brand;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    // Filter by status (active by default)
    query.status = req.query.status || 'active';

    // Filter by featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Sort options
    let sortBy: any = { createdAt: -1 }; // Default sort
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price-asc':
          sortBy = { price: 1 };
          break;
        case 'price-desc':
          sortBy = { price: -1 };
          break;
        case 'name-asc':
          sortBy = { name: 1 };
          break;
        case 'name-desc':
          sortBy = { name: -1 };
          break;
        case 'rating':
          sortBy = { 'rating.average': -1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'oldest':
          sortBy = { createdAt: 1 };
          break;
      }
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .populate('category', 'name slug');

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;

    const products = await Product.find({ 
      featured: true, 
      status: 'active' 
    })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category: req.params.category,
      status: 'active'
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');

    const total = await Product.countDocuments({ 
      category: req.params.category,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 6;

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ],
      status: 'active'
    })
      .limit(limit)
      .sort({ 'rating.average': -1 })
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts
};