// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  totalSpent: number;
  orderCount: number;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  inStock: boolean;
  stock: number;
  rating?: {
    average: number;
    count: number;
  };
  features: string[];
  specifications: Record<string, string>;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  tax: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: {
    url: string;
    publicId: string;
    altText?: string;
  };
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    sales: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  inStock: boolean;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  isNew: boolean;
  isFeatured: boolean;
}

export interface CategoryForm {
  name: string;
  description?: string;
  icon: string;
  image?: File;
  isActive: boolean;
}

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
}

// Filter Types
export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  inStock: boolean | null;
  isFeatured: boolean | null;
  sortBy: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

export interface OrderFilters {
  search: string;
  status: string;
  paymentStatus: string;
  dateRange: [string, string];
  sortBy: 'createdAt' | 'totalAmount' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  dateRange: [string, string];
  sortBy: 'firstName' | 'email' | 'createdAt' | 'totalSpent';
  sortOrder: 'asc' | 'desc';
}
