import api from '../lib/api/config';
import CryptoJS from 'crypto-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Hash password before sending to backend
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

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
  phone?: string;
  role: string;
  avatar?: {
    url: string;
  };
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
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
    // Hash password before sending
    const hashedPassword = hashPassword(credentials.password);
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: hashedPassword
    }) as AuthResponse;
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Hash password before sending
    const hashedPassword = hashPassword(userData.password);
    const response = await api.post('/auth/register', {
      ...userData,
      password: hashedPassword
    }) as AuthResponse;
    
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
    const response = await api.get('/auth/me') as any;
    return response.data || response.user;
  }

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', profileData) as any;
    
    if (response.success) {
      const updatedUser = response.data || response.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Hash passwords before sending
    const response = await api.put('/auth/password', {
      currentPassword: hashPassword(currentPassword),
      newPassword: hashPassword(newPassword)
    }) as any;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    const response = await api.post('/auth/forgot-password', { email }) as any;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to send reset email');
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash password before sending
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword: hashPassword(newPassword)
    }) as any;
    
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

  // Google OAuth login/register
  async googleAuth(tokenId: string): Promise<AuthResponse> {
    const response = await api.post('/auth/google', { tokenId }) as AuthResponse;
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }
}

export default new AuthService();