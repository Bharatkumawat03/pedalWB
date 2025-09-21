// Export all services
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as cartService } from './cartService';
export { default as wishlistService } from './wishlistService';
export { default as orderService } from './orderService';
export { default as userService } from './userService';
export { default as categoryService } from './categoryService';

// Export types
export type { LoginCredentials, RegisterData, User, AuthResponse } from './authService';
export type { ProductFilters, PaginationInfo } from './productService';
export type { CartItem, CartSummary, CartResponse } from './cartService';
export type { WishlistItem, WishlistResponse } from './wishlistService';
export type { OrderItem, Address, CreateOrderData } from './orderService';
export type { UserProfile, UserPreferences } from './userService';
export type { Category } from './categoryService';