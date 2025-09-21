import api from '../lib/api/config';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{ url: string; isPrimary: boolean }>;
    category: string;
    brand: string;
    inventory: {
      inStock: boolean;
      quantity: number;
    };
  };
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  itemTotal: number;
  addedAt: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingEligible: boolean;
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    summary: CartSummary;
  };
}

class CartService {
  // Get user's cart
  async getCart(): Promise<CartResponse> {
    return await api.get('/cart');
  }

  // Add item to cart
  async addToCart(productId: string, quantity = 1, selectedColor?: string, selectedSize?: string): Promise<any> {
    return await api.post('/cart/add', {
      productId,
      quantity,
      selectedColor,
      selectedSize
    });
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number): Promise<any> {
    return await api.put(`/cart/${itemId}`, { quantity });
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<any> {
    return await api.delete(`/cart/${itemId}`);
  }

  // Clear entire cart
  async clearCart(): Promise<any> {
    return await api.delete('/cart');
  }

  // Get cart item count
  async getCartCount(): Promise<number> {
    const response = await api.get('/cart/count');
    return response.data.count;
  }
}

export default new CartService();