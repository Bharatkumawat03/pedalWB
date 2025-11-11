import api from '@/lib/api/config';
import { LoginForm, User } from '@/types';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    // The api interceptor already returns response.data, so response IS the data
    const response = await api.post('/admin/auth/login', credentials) as any;
    
    if (response && response.success && response.token) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    // The api interceptor already returns response.data
    const response = await api.get('/admin/auth/me') as any;
    return response.data || response;
  }

  async logout(): Promise<void> {
    await api.post('/admin/auth/logout');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }
}

export default new AuthService();
