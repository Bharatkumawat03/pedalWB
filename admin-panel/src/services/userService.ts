import api from '@/lib/api/config';
import { User, UserForm, UserFilters } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class UserService {
  // Get all users with filters and pagination
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<UserFilters>
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  // Get single user
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  }

  // Create new user
  async createUser(userData: UserForm): Promise<User> {
    const response = await api.post('/admin/users', userData);
    return response.data.data;
  }

  // Update user
  async updateUser(id: string, userData: Partial<UserForm>): Promise<User> {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  // Suspend user
  async suspendUser(id: string, reason: string): Promise<User> {
    const response = await api.patch(`/admin/users/${id}/suspend`, { reason });
    return response.data.data;
  }

  // Activate user
  async activateUser(id: string): Promise<User> {
    const response = await api.patch(`/admin/users/${id}/activate`);
    return response.data.data;
  }

  // Get user analytics
  async getUserAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
    const response = await api.get(`/admin/users/analytics?period=${period}`);
    return response.data.data;
  }

  // Export users
  async exportUsers(filters?: Partial<UserFilters>): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/admin/users/export?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  }
}

export default new UserService();
