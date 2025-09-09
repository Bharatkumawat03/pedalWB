import api from '../lib/api/config';

export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: Array<{ url: string; isPrimary: boolean }>;
    category: string;
    brand: string;
    rating: {
      average: number;
      count: number;
    };
    inventory: {
      inStock: boolean;
    };
  };
  addedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: {
    items: WishlistItem[];
    count: number;
  };
}

class WishlistService {
  // Get user's wishlist
  async getWishlist(): Promise<WishlistResponse> {
    return await api.get('/wishlist');
  }

  // Add item to wishlist
  async addToWishlist(productId: string): Promise<any> {
    return await api.post('/wishlist/add', { productId });
  }

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<any> {
    return await api.delete(`/wishlist/${productId}`);
  }

  // Toggle item in wishlist
  async toggleWishlist(productId: string): Promise<any> {
    return await api.post('/wishlist/toggle', { productId });
  }

  // Clear entire wishlist
  async clearWishlist(): Promise<any> {
    return await api.delete('/wishlist');
  }

  // Check if product is in wishlist
  async checkWishlist(productId: string): Promise<boolean> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data.inWishlist;
  }

  // Move wishlist item to cart
  async moveToCart(productId: string, quantity = 1, selectedColor?: string, selectedSize?: string): Promise<any> {
    return await api.post(`/wishlist/${productId}/move-to-cart`, {
      quantity,
      selectedColor,
      selectedSize
    });
  }
}

export default new WishlistService();