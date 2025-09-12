import User, { IUser, ICartItem } from '../models/User';
import Product from '../models/Product';

export interface AddToCartData {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface UpdateCartItemData {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

class CartService {
  async getCart(userId: string): Promise<ICartItem[]> {
    const user = await User.findById(userId).populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.cart;
  }

  async addToCart(userId: string, cartData: AddToCartData): Promise<ICartItem[]> {
    const { productId, quantity, selectedColor, selectedSize } = cartData;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if product is in stock
    if (!product.inventory.inStock || product.inventory.quantity < quantity) {
      throw new Error('Product is out of stock');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(
      item => item.product.toString() === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
    );

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      
      // Check if total quantity exceeds stock
      if (existingCartItem.quantity > product.inventory.quantity) {
        throw new Error('Requested quantity exceeds available stock');
      }
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize,
        addedAt: new Date()
      });
    }

    await user.save();

    // Populate cart items for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    return user.cart;
  }

  async updateCartItem(
    userId: string, 
    itemId: string, 
    updateData: UpdateCartItemData
  ): Promise<ICartItem[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Check stock availability for new quantity
    const product = await Product.findById(cartItem.product);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.inventory.inStock || product.inventory.quantity < updateData.quantity) {
      throw new Error('Requested quantity exceeds available stock');
    }

    // Update cart item
    cartItem.quantity = updateData.quantity;
    if (updateData.selectedColor !== undefined) {
      cartItem.selectedColor = updateData.selectedColor;
    }
    if (updateData.selectedSize !== undefined) {
      cartItem.selectedSize = updateData.selectedSize;
    }

    await user.save();

    // Populate cart items for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    return user.cart;
  }

  async removeFromCart(userId: string, itemId: string): Promise<ICartItem[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove item using Mongoose array methods
    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    cartItem.deleteOne();
    await user.save();

    // Populate cart items for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    return user.cart;
  }

  async clearCart(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.cart = [];
    await user.save();
  }

  async getCartSummary(userId: string): Promise<{
    itemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }> {
    const cart = await this.getCart(userId);
    
    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
      const product = item.product as any; // Already populated
      subtotal += product.price * item.quantity;
      itemCount += item.quantity;
    });

    // Calculate tax (18% GST for India)
    const tax = subtotal * 0.18;
    
    // Calculate shipping (free for orders above ₹2000)
    const shipping = subtotal >= 2000 ? 0 : 150;
    
    const total = subtotal + tax + shipping;

    return {
      itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100
    };
  }
}

export default new CartService();