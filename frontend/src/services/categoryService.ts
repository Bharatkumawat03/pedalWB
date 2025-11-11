import api from '../lib/api/config';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: {
    url: string;
    altText: string;
  };
  productCount?: number;
  subcategories?: Category[];
}

class CategoryService {
  // Get all categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await api.get(`/categories${params}`) as any;
    // API interceptor returns response.data, so response is already the data
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  // Get single category by slug
  async getCategory(slug: string): Promise<Category> {
    const response = await api.get(`/categories/slug/${slug}`) as any;
    // API interceptor returns response.data, so response is already the data
    return response.data || response;
  }

  // Get single category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  // Get category products
  async getCategoryProducts(slug: string, filters: any = {}): Promise<any> {
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

    return await api.get(`/categories/${slug}/products?${params.toString()}`);
  }
}

export default new CategoryService();