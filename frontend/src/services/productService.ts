import api from '../lib/api/config';

export interface ProductFilters {
  category?: string;
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'newest' | 'name' | 'price-low' | 'price-high' | 'rating';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  totalProducts: number;
}

export interface ProductsResponse {
  success: boolean;
  data: any[];
  pagination: PaginationInfo;
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: any;
    relatedProducts: any[];
  };
}

class ProductService {
  // Get all products with filters
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await api.get(`/products?${params.toString()}`) as any;
    // API interceptor returns response.data, so response is already the data object
    // Backend returns: { success: true, count: number, total: number, pagination: {...}, data: [...] }
    return {
      success: response.success || true,
      data: response.data || [],
      pagination: response.pagination || {
        current: 1,
        total: 1,
        count: response.data?.length || 0,
        totalProducts: response.total || 0
      }
    };
  }

  // Get single product by ID
  async getProduct(productId: string): Promise<ProductResponse> {
    const response = await api.get(`/products/${productId}`);
    return response;
  }

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<any[]> {
    try {
      const response = await api.get(`/products/featured?limit=${limit}`) as any;
      // API interceptor returns response.data, so response is already the data object
      // Backend returns: { success: true, count: number, data: [...] }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Get new products
  async getNewProducts(limit = 8): Promise<any[]> {
    try {
      const response = await api.get(`/products/new?limit=${limit}`) as any;
      // API interceptor returns response.data, so response is already the data object
      // Backend returns: { success: true, count: number, data: [...] }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching new products:', error);
      return [];
    }
  }

  // Get best sellers
  async getBestSellers(limit = 8): Promise<any[]> {
    try {
      const response = await api.get(`/products/bestsellers?limit=${limit}`) as any;
      // API interceptor returns response.data, so response is already the data object
      // Backend returns: { success: true, count: number, data: [...] }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string, limit = 10): Promise<any[]> {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
        return response.data.products;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get product reviews
  async getProductReviews(productId: string, page = 1, limit = 10, sort = 'newest', type?: 'rating' | 'review'): Promise<any> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort: String(sort)
    });
    if (type) {
      params.append('type', type);
    }
    const response = await api.get(`/products/${productId}/reviews?${params.toString()}`);
    return response;
  }

  // Check if user can rate/review a product
  async canUserRate(productId: string): Promise<any> {
    const response = await api.get(`/products/${productId}/can-rate`);
    return response;
  }

  // Submit a rating (without review)
  async submitRating(productId: string, rating: number): Promise<any> {
    const response = await api.post(`/products/${productId}/rate`, { rating });
    return response;
  }

  // Submit a review (with rating and text)
  async submitReview(productId: string, reviewData: { rating: number; title: string; comment: string; images?: string[] }): Promise<any> {
    const response = await api.post(`/products/${productId}/review`, reviewData);
    return response;
  }

  // Get product categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await api.get('/categories');
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
        return response.data.categories;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get product brands
  async getBrands(): Promise<any[]> {
    try {
      const response = await api.get('/brands');
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.brands && Array.isArray(response.data.brands)) {
        return response.data.brands;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }
}

const productService = new ProductService();
export default productService;
