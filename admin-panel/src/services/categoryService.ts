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
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/admin/categories');
    return response.data.data;
  }

  // Get categories with pagination
  async getCategoriesPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Category>> {
    const response = await api.get(`/admin/categories?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get single category
  async getCategory(id: string): Promise<Category> {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data.data;
  }

  // Create new category
  async createCategory(categoryData: CategoryForm): Promise<Category> {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description || '');
    formData.append('icon', categoryData.icon);
    formData.append('isActive', categoryData.isActive.toString());
    
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await api.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  // Update category
  async updateCategory(id: string, categoryData: Partial<CategoryForm>): Promise<Category> {
    const formData = new FormData();
    
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description !== undefined) formData.append('description', categoryData.description);
    if (categoryData.icon) formData.append('icon', categoryData.icon);
    if (categoryData.isActive !== undefined) formData.append('isActive', categoryData.isActive.toString());
    
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await api.put(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  }

  // Toggle category status
  async toggleCategoryStatus(id: string): Promise<Category> {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`);
    return response.data.data;
  }

  // Get category analytics
  async getCategoryAnalytics() {
    const response = await api.get('/admin/categories/analytics');
    return response.data.data;
  }
}

export default new CategoryService();
