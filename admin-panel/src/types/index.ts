// Types for admin panel

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: Array<{ url: string; isPrimary?: boolean }>;
  category?: string;
  brand?: string;
  inventory?: {
    inStock: boolean;
    quantity: number;
  };
  stock?: number;
  status?: string;
  featured?: boolean;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ProductForm {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  stock?: number;
  status?: string;
  featured?: boolean;
  isNew?: boolean;
  images?: File[];
  [key: string]: any;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  avatar?: {
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  password?: string;
  [key: string]: any;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Order {
  _id: string;
  orderNumber?: string;
  id?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  customer?: {
    name: string;
    email: string;
    avatar?: string;
  };
  items?: Array<{
    product: any;
    quantity: number;
    price: number;
    name?: string;
  }>;
  total?: number;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt?: string;
  orderDate?: string;
  [key: string]: any;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: {
    url: string;
  };
  isActive?: boolean;
  productCount?: number;
  [key: string]: any;
}

export interface CategoryForm {
  name: string;
  description?: string;
  icon?: string;
  image?: File;
  isActive?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers?: number;
  activeProducts?: number;
  completedOrders?: number;
  pendingOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  cancelledOrders?: number;
  lowStockProducts?: number;
  outOfStockProducts?: number;
  newUsersThisMonth?: number;
  conversionRate?: number;
  recentOrders?: Order[];
  topProducts?: Array<{
    product: Product;
    sales: number;
  }>;
  monthlyRevenue?: Array<{
    month: string;
    revenue: number;
  }>;
  userGrowth?: Array<{
    month: string;
    users: number;
  }>;
}

