import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';
import Product from '../models/Product';

export interface CategoryWithCount {
  _id: any;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: {
    url?: string;
    publicId?: string;
    altText?: string;
  };
  status: 'active' | 'inactive';
  sortOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  parent?: mongoose.Types.ObjectId;
  productCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
}

class CategoryService {
  async getCategories(): Promise<ICategory[]> {
    return await Category.find({ status: 'active' }).sort({ name: 1 });
  }

  async getCategoriesWithCount(): Promise<CategoryWithCount[]> {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id, 
          status: 'active' 
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    return categoriesWithCount;
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    return await Category.findOne({ slug, status: 'active' });
  }

  async getCategoryTree(): Promise<ICategory[]> {
    // Get all categories and organize into hierarchical structure
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    
    // For now, return flat structure
    // In the future, this could build a proper tree with parent-child relationships
    return categories;
  }

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    return await Category.create(categoryData);
  }

  async updateCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id, 
      categoryData, 
      { new: true, runValidators: true }
    );
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    return await Category.findByIdAndDelete(id);
  }

  async deactivateCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );
  }

  async getFeaturedCategories(limit: number = 6): Promise<CategoryWithCount[]> {
    const categories = await Category.find({ 
      status: 'active'
    }).limit(limit).sort({ sortOrder: 1, name: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id, 
          status: 'active' 
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    return categoriesWithCount;
  }

  async getCategoryStats(id: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    averagePrice: number;
  }> {
    const totalProducts = await Product.countDocuments({ category: id });
    const activeProducts = await Product.countDocuments({ 
      category: id, 
      status: 'active' 
    });
    const inactiveProducts = totalProducts - activeProducts;

    // Calculate average price of active products
    const priceAggregation = await Product.aggregate([
      { $match: { category: id, status: 'active' } },
      { $group: { _id: null, averagePrice: { $avg: '$price' } } }
    ]);

    const averagePrice = priceAggregation.length > 0 
      ? Math.round(priceAggregation[0].averagePrice * 100) / 100 
      : 0;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      averagePrice
    };
  }
}

export default new CategoryService();