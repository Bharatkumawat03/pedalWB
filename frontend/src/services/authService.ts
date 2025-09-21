import api from '../lib/api/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
  };
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', profileData);
    
    if (response.success) {
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    const response = await api.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to send reset email');
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();