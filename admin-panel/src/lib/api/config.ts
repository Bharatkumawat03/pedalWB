import axios from 'axios';

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return the data portion of the response for the service methods
    return response.data;
  },
  (error) => {
    // Handle common errors without redirecting
    if (error.response?.status === 401) {
      // Just clear token, don't redirect
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const errorObj = new Error(errorMessage);
    (errorObj as any).response = error.response;
    return Promise.reject(errorObj);
  }
);

export default api;


