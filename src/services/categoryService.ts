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
    const response = await api.get(`/categories${params}`);
    return response.data;
  }

  // Get single category
  async getCategory(slug: string): Promise<Category> {
    const response = await api.get(`/categories/${slug}`);
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