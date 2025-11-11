import Product, { IProduct } from '../models/Product';
import { FilterQuery, SortOrder } from 'mongoose';

export interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  featured?: boolean;
  sortBy?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ProductResponse {
  products: IProduct[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

class ProductService {
  async getProducts(query: ProductQuery, pagination: PaginationOptions): Promise<ProductResponse> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build MongoDB query
    const mongoQuery: FilterQuery<IProduct> = {};

    // Search by name or description
    if (query.search) {
      mongoQuery.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (query.category && query.category !== 'all') {
      mongoQuery.category = query.category;
    }

    // Filter by brand
    if (query.brand && query.brand !== 'all') {
      mongoQuery.brand = query.brand;
    }

    // Filter by price range
    if (query.minPrice || query.maxPrice) {
      mongoQuery.price = {};
      if (query.minPrice) {
        mongoQuery.price.$gte = query.minPrice;
      }
      if (query.maxPrice) {
        mongoQuery.price.$lte = query.maxPrice;
      }
    }

    // Filter by status (active by default)
    mongoQuery.status = query.status || 'active';

    // Filter by featured
    if (query.featured === true) {
      mongoQuery.featured = true;
    }

    // Sort options
    let sortBy: { [key: string]: SortOrder } = { createdAt: -1 }; // Default sort
    if (query.sortBy) {
      switch (query.sortBy) {
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

    const products = await Product.find(mongoQuery)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .populate('category', 'name slug');

    const total = await Product.countDocuments(mongoQuery);

    return {
      products,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate('category', 'name slug');
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return await Product.findOne({ slug }).populate('category', 'name slug');
  }

  async getFeaturedProducts(limit: number = 8): Promise<IProduct[]> {
    return await Product.find({ featured: true, status: 'active' })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');
  }

  async getNewProducts(limit: number = 12): Promise<IProduct[]> {
    return await Product.find({ status: 'active' })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');
  }

  async getBestSellers(limit: number = 8): Promise<IProduct[]> {
    // Get products with highest ratings and in stock, sorted by rating
    return await Product.find({ 
      status: 'active',
      'inventory.inStock': true,
      'rating.count': { $gt: 0 } // Only products with reviews
    })
      .limit(limit)
      .sort({ 'rating.average': -1, 'rating.count': -1 }) // Sort by rating average, then by review count
      .populate('category', 'name slug');
  }

  async getProductsByCategory(categoryId: string, limit: number = 12): Promise<IProduct[]> {
    return await Product.find({ category: categoryId, status: 'active' })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');
  }

  async getRelatedProducts(productId: string, category: string, limit: number = 6): Promise<IProduct[]> {
    return await Product.find({
      _id: { $ne: productId },
      category: category,
      status: 'active'
    })
      .limit(limit)
      .sort({ 'rating.average': -1 })
      .populate('category', 'name slug');
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(productData);
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, productData, { 
      new: true, 
      runValidators: true 
    }).populate('category', 'name slug');
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id);
  }

  async updateInventory(productId: string, quantity: number): Promise<void> {
    await Product.findByIdAndUpdate(productId, {
      $inc: { 'inventory.quantity': quantity }
    });
  }

  async checkProductStock(productId: string, requiredQuantity: number): Promise<boolean> {
    const product = await Product.findById(productId);
    if (!product) return false;
    return product.inventory.inStock && product.inventory.quantity >= requiredQuantity;
  }
}

export default new ProductService();