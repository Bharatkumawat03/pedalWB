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
    const response = await api.post('/admin/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/admin/auth/me');
    return response.data.data;
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
