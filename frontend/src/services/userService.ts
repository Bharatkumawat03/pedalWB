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
    return await api.get('/users/profile');
  }

  // Update user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<any> {
    return await api.put('/users/profile', profileData);
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
    const response = await api.get('/users/addresses');
    return response.data;
  }

  async addAddress(address: Omit<Address, '_id'>): Promise<any> {
    return await api.post('/users/addresses', address);
  }

  async updateAddress(addressId: string, address: Partial<Address>): Promise<any> {
    return await api.put(`/users/addresses/${addressId}`, address);
  }

  async deleteAddress(addressId: string): Promise<any> {
    return await api.delete(`/users/addresses/${addressId}`);
  }
}

export default new UserService();