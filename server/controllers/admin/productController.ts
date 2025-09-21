import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import { AuthenticatedRequest } from '../../types';
import { productService } from '../../services/productService';

// @desc    Get all products with admin filters and pagination
// @route   GET /api/admin/products
// @access  Private/Admin
export const getProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }

    if (req.query.isFeatured !== undefined) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    // Build sort object
    const sort: any = {};
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/admin/products/:id
// @access  Private/Admin
export const getProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/admin/products/upload-images
// @access  Private/Admin
export const uploadImages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This would handle file uploads
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Image upload functionality will be implemented',
      urls: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update products
// @route   PATCH /api/admin/products/bulk-update
// @access  Private/Admin
export const bulkUpdateProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      res.status(400).json({
        success: false,
        message: 'Updates must be an array'
      });
      return;
    }

    // Process bulk updates
    const results = [];
    for (const update of updates) {
      const product = await productService.updateProduct(update.id, update.data);
      results.push(product);
    }

    res.json({
      success: true,
      message: 'Products updated successfully',
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete products
// @route   DELETE /api/admin/products/bulk-delete
// @access  Private/Admin
export const bulkDeleteProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({
        success: false,
        message: 'IDs must be an array'
      });
      return;
    }

    // Delete products
    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
