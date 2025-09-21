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

    const response = await api.get(`/products?${params.toString()}`);
    return response;
  }

  // Get single product by ID
  async getProduct(productId: string): Promise<ProductResponse> {
    const response = await api.get(`/products/${productId}`);
    return response;
  }

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<any[]> {
    try {
      const response = await api.get(`/products/featured?limit=${limit}`);
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
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Get new products
  async getNewProducts(limit = 8): Promise<any[]> {
    try {
      const response = await api.get(`/products/new?limit=${limit}`);
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
      console.error('Error fetching new products:', error);
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
  async getProductReviews(productId: string, page = 1, limit = 10, sort = 'newest'): Promise<any> {
    const response = await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}&sort=${sort}`);
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
