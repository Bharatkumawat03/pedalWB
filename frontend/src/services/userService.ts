import api from '../lib/api/config';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface Address {
  _id?: string;
  type: 'home' | 'office' | 'other';
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
}

class UserService {
  // Get user profile
  async getUserProfile(): Promise<any> {
    const response = await api.get('/users/profile') as any;
    return response;
  }

  // Update user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<any> {
    const response = await api.put('/users/profile', profileData) as any;
    return response;
  }

  // Get user dashboard data
  async getDashboard(): Promise<any> {
    return await api.get('/users/dashboard');
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<any> {
    return await api.put('/users/preferences', preferences);
  }

  // Address management
  async getAddresses(): Promise<Address[]> {
    const response = await api.get('/users/addresses') as any;
    return response.data || response;
  }

  async addAddress(address: Omit<Address, '_id'>): Promise<any> {
    const response = await api.post('/users/addresses', address) as any;
    return response;
  }

  async updateAddress(addressId: string, address: Partial<Address>): Promise<any> {
    const response = await api.put(`/users/addresses/${addressId}`, address) as any;
    return response;
  }

  async deleteAddress(addressId: string): Promise<any> {
    const response = await api.delete(`/users/addresses/${addressId}`) as any;
    return response;
  }
}

export default new UserService();