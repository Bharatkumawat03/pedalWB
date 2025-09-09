import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/Category';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'active'; // Default to active categories
    }

    // Filter by parent
    if (req.query.parent) {
      query.parent = req.query.parent;
    } else if (req.query.parent === 'null') {
      query.parent = null; // Root categories only
    }

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .populate('children')
      .skip(skip)
      .limit(limit)
      .sort({ sortOrder: 1, name: 1 });

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug')
      .populate('children');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug')
      .populate('children');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('parent', 'name slug').populate('children');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
      return;
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: category._id });
    if (childrenCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
      return;
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get all active categories
    const categories = await Category.find({ status: 'active' })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create category map
    categories.forEach(category => {
      categoryMap.set(category._id.toString(), { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category._id.toString());
      
      if (category.parent) {
        const parent = categoryMap.get(category.parent.toString());
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    res.status(200).json({
      success: true,
      data: rootCategories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with product count
// @route   GET /api/categories/with-counts
// @access  Public
export const getCategoriesWithCounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'products',
          localField: 'name',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          products: 0 // Remove products array from response
        }
      },
      { $sort: { sortOrder: 1, name: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products for a category
// @route   GET /api/categories/:slug/products
// @access  Public
export const getCategoryProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = { category: req.params.slug, status: 'active' };

    // Apply additional filters from query params
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = req.query.brand;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    // Sort options
    let sortBy: any = { createdAt: -1 };
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
        case 'rating':
          sortBy = { 'rating.average': -1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
      }
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortBy);

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

export default {
  getCategories,
  getCategory,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getCategoriesWithCounts
};