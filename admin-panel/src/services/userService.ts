import api from '@/lib/api/config';
import { User, UserForm, UserFilters } from '@/types/index';

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

    // API interceptor returns { success: true, data: [...], pagination: {...} }
    const response = await api.get(`/admin/users?${params.toString()}`) as any;
    // Return structure expected by hooks: { data: [...], pagination: {...} }
    return {
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }

  // Get single user
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/admin/users/${id}`) as any;
    return response.data || response;
  }

  // Create new user
  async createUser(userData: UserForm): Promise<User> {
    // Transform frontend format to backend format
    const transformedData: any = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role === 'Admin' ? 'admin' : 'user',
      status: userData.status.toLowerCase() as 'active' | 'inactive' | 'suspended',
      password: 'defaultPassword123', // Default password - should be changed by user
      emailVerified: false
    };

    const response = await api.post('/admin/users', transformedData) as any;
    return response.data || response;
  }

  // Update user
  async updateUser(id: string, userData: Partial<UserForm>): Promise<User> {
    // Transform frontend format to backend format
    const transformedData: any = {};

    if (userData.firstName !== undefined) transformedData.firstName = userData.firstName;
    if (userData.lastName !== undefined) transformedData.lastName = userData.lastName;
    if (userData.email !== undefined) transformedData.email = userData.email;
    if (userData.phone !== undefined) transformedData.phone = userData.phone;
    if (userData.role !== undefined) transformedData.role = userData.role === 'Admin' ? 'admin' : 'user';
    if (userData.status !== undefined) transformedData.status = userData.status.toLowerCase() as 'active' | 'inactive' | 'suspended';

    const response = await api.put(`/admin/users/${id}`, transformedData) as any;
    return response.data || response;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  // Suspend user
  async suspendUser(id: string, reason: string): Promise<User> {
    const response = await api.patch(`/admin/users/${id}/suspend`, { reason }) as any;
    return response.data || response;
  }

  // Activate user
  async activateUser(id: string): Promise<User> {
    const response = await api.patch(`/admin/users/${id}/activate`) as any;
    return response.data || response;
  }

  // Get user analytics
  async getUserAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
    const response = await api.get(`/admin/users/analytics?period=${period}`) as any;
    return response.data || response;
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
