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

    return await api.get(`/products?${params.toString()}`);
  }

  // Get single product
  async getProduct(id: string): Promise<ProductResponse> {
    return await api.get(`/products/${id}`);
  }

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<any[]> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  }

  // Get new products
  async getNewProducts(limit = 8): Promise<any[]> {
    const response = await api.get(`/products/new?limit=${limit}`);
    return response.data;
  }

  // Search products
  async searchProducts(query: string, limit = 10): Promise<any[]> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  }

  // Get product reviews
  async getProductReviews(productId: string, page = 1, limit = 10, sort = 'newest'): Promise<any> {
    return await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}&sort=${sort}`);
  }

  // Add product review
  async addProductReview(productId: string, review: {
    rating: number;
    title: string;
    comment: string;
  }): Promise<any> {
    return await api.post(`/products/${productId}/reviews`, review);
  }

  // Admin: Create product
  async createProduct(productData: any): Promise<any> {
    return await api.post('/products', productData);
  }

  // Admin: Update product
  async updateProduct(id: string, productData: any): Promise<any> {
    return await api.put(`/products/${id}`, productData);
  }

  // Admin: Delete product
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

export default new ProductService();