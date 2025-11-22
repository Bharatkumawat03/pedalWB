import { Request, Response } from 'express';
import { Brand, IBrand } from '../models/Brand';
import Product, { IProduct } from '../models/Product';

// Get all brands with filtering, sorting, and pagination
export const getBrands = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      country,
      tier,
      featured,
      sortBy = 'name',
      sortOrder = 'asc',
      minProducts,
      maxProducts
    } = req.query;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (country && country !== 'all') {
      query.country = country;
    }

    if (tier && tier !== 'all') {
      query.tier = tier;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minProducts || maxProducts) {
      query.productCount = {};
      if (minProducts) {
        query.productCount.$gte = parseInt(minProducts as string);
      }
      if (maxProducts) {
        query.productCount.$lte = parseInt(maxProducts as string);
      }
    }

    // Sort options
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [brands, total] = await Promise.all([
      Brand.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Brand.countDocuments(query)
    ]);

    // Get country options for filters
    const countries = await Brand.distinct('country');

    res.json({
      brands,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: {
        countries
      }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

// Get single brand by ID or slug
export const getBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    const brand = await Brand.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Get brand's products
    const products = await Product.find({ brand: brand.name })
      .select('name price images category status')
      .lean();

    res.json({
      brand,
      products,
      productCount: products.length
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

// Create new brand
export const createBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const brandData = req.body;

    // Check if brand with same name already exists
    const existingBrand = await Brand.findOne({ name: brandData.name });
    if (existingBrand) {
      return res.status(400).json({ error: 'Brand with this name already exists' });
    }

    const brand = new Brand(brandData);
    await brand.save();

    res.status(201).json({
      message: 'Brand created successfully',
      brand
    });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

// Update brand
export const updateBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== brand.name) {
      const existingBrand = await Brand.findOne({ 
        name: updateData.name,
        _id: { $ne: id }
      });
      if (existingBrand) {
        return res.status(400).json({ error: 'Brand with this name already exists' });
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Brand updated successfully',
      brand: updatedBrand
    });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Check if brand has products
    const productCount = await Product.countDocuments({ brand: brand.name });
    if (productCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete brand with existing products',
        productCount 
      });
    }

    await Brand.findByIdAndDelete(id);

    res.json({
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};

// Toggle brand status
export const toggleBrandStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const newStatus = brand.status === 'Active' ? 'Inactive' : 'Active';
    
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json({
      message: `Brand status changed to ${newStatus}`,
      brand: updatedBrand
    });
  } catch (error) {
    console.error('Error toggling brand status:', error);
    res.status(500).json({ error: 'Failed to update brand status' });
  }
};

// Get brand statistics
export const getBrandStats = async (req: Request, res: Response) => {
  try {
    const [
      totalBrands,
      activeBrands,
      premiumBrands,
      featuredBrands,
      brandsByCountry,
      brandsByTier,
      topPerformingBrands
    ] = await Promise.all([
      Brand.countDocuments(),
      Brand.countDocuments({ status: 'Active' }),
      Brand.countDocuments({ tier: 'Premium' }),
      Brand.countDocuments({ featured: true }),
      Brand.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Brand.aggregate([
        { $group: { _id: '$tier', count: { $sum: 1 } } }
      ]),
      Brand.find()
        .sort({ revenue: -1, productCount: -1 })
        .limit(10)
        .select('name country productCount revenue tier status')
        .lean()
    ]);

    const totalRevenue = await Brand.aggregate([
      { $group: { _id: null, total: { $sum: '$revenue' } } }
    ]);

    const totalProducts = await Brand.aggregate([
      { $group: { _id: null, total: { $sum: '$productCount' } } }
    ]);

    res.json({
      totalBrands,
      activeBrands,
      premiumBrands,
      featuredBrands,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts: totalProducts[0]?.total || 0,
      brandsByCountry,
      brandsByTier,
      topPerformingBrands
    });
  } catch (error) {
    console.error('Error fetching brand stats:', error);
    res.status(500).json({ error: 'Failed to fetch brand statistics' });
  }
};

// Update product counts for all brands
export const updateProductCounts = async (req: Request, res: Response) => {
  try {
    await (Brand as any).updateProductCounts();
    
    res.json({
      message: 'Product counts updated successfully'
    });
  } catch (error) {
    console.error('Error updating product counts:', error);
    res.status(500).json({ error: 'Failed to update product counts' });
  }
};

// Bulk operations
export const bulkUpdateBrands = async (req: Request, res: Response): Promise<any> => {
  try {
    const { brandIds, updateData } = req.body;

    if (!brandIds || !Array.isArray(brandIds) || brandIds.length === 0) {
      return res.status(400).json({ error: 'Invalid brand IDs' });
    }

    const result = await Brand.updateMany(
      { _id: { $in: brandIds } },
      updateData,
      { runValidators: true }
    );

    res.json({
      message: 'Brands updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating brands:', error);
    res.status(500).json({ error: 'Failed to update brands' });
  }
};

export const bulkDeleteBrands = async (req: Request, res: Response): Promise<any> => {
  try {
    const { brandIds } = req.body;

    if (!brandIds || !Array.isArray(brandIds) || brandIds.length === 0) {
      return res.status(400).json({ error: 'Invalid brand IDs' });
    }

    // Check if any brands have products
    const brands = await Brand.find({ _id: { $in: brandIds } });
    const brandNames = brands.map(b => b.name);
    
    const productCount = await Product.countDocuments({ 
      brand: { $in: brandNames } 
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete brands with existing products',
        productCount 
      });
    }

    const result = await Brand.deleteMany({ _id: { $in: brandIds } });

    res.json({
      message: 'Brands deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting brands:', error);
    res.status(500).json({ error: 'Failed to delete brands' });
  }
};
