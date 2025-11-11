import api from '@/lib/api/config';
import { Category, CategoryForm } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class CategoryService {
  // Get all categories (non-paginated, for dropdowns)
  async getCategories(): Promise<Category[]> {
    // API interceptor returns { success: true, data: [...] }
    // For non-paginated endpoint, we might need to check the actual endpoint
    const response = await api.get('/admin/categories') as any;
    // If it's paginated response, extract data, otherwise return directly
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // Fallback: if response is already an array
    return Array.isArray(response) ? response : [];
  }

  // Get categories with pagination
  async getCategoriesPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Category>> {
    // API interceptor returns { success: true, data: [...], pagination: {...} }
    const response = await api.get(`/admin/categories?page=${page}&limit=${limit}`) as any;
    // Return structure expected by hooks: { data: [...], pagination: {...} }
    return {
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }

  // Get single category
  async getCategory(id: string): Promise<Category> {
    const response = await api.get(`/admin/categories/${id}`) as any;
    return response.data || response;
  }

  // Create new category
  async createCategory(categoryData: CategoryForm): Promise<Category> {
    // Backend expects JSON, not FormData (file uploads not implemented yet)
    const payload: any = {
      name: categoryData.name,
      description: categoryData.description || '',
      icon: categoryData.icon || '🏷️',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
    };

    const response = await api.post('/admin/categories', payload) as any;
    return response.data || response;
  }

  // Update category
  async updateCategory(id: string, categoryData: Partial<CategoryForm>): Promise<Category> {
    // Backend expects JSON, not FormData (file uploads not implemented yet)
    const payload: any = {};
    
    if (categoryData.name) payload.name = categoryData.name;
    if (categoryData.description !== undefined) payload.description = categoryData.description;
    if (categoryData.icon) payload.icon = categoryData.icon;
    if (categoryData.isActive !== undefined) payload.isActive = categoryData.isActive;

    const response = await api.put(`/admin/categories/${id}`, payload) as any;
    return response.data || response;
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  }

  // Toggle category status
  async toggleCategoryStatus(id: string): Promise<Category> {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`) as any;
    return response.data || response;
  }

  // Get category analytics
  async getCategoryAnalytics() {
    const response = await api.get('/admin/categories/analytics') as any;
    return response.data || response;
  }
}

export default new CategoryService();
