import mongoose from 'mongoose';
import User, { IUser, IWishlistItem } from '../models/User';
import Product from '../models/Product';

class WishlistService {
  async getWishlist(userId: string): Promise<IWishlistItem[]> {
    const user = await User.findById(userId).populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.wishlist;
  }

  async addToWishlist(userId: string, productId: string): Promise<IWishlistItem[]> {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if item already exists in wishlist
    const existingWishlistItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    if (existingWishlistItem) {
      throw new Error('Product already in wishlist');
    }

    // Add new item to wishlist
    user.wishlist.push({
      product: new mongoose.Types.ObjectId(productId),
      addedAt: new Date()
    } as any);

    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    return user.wishlist;
  }

  async removeFromWishlist(userId: string, itemId: string): Promise<IWishlistItem[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove item using Mongoose array methods
    const wishlistItem = user.wishlist.id(itemId);
    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    wishlistItem.deleteOne();
    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    return user.wishlist;
  }

  async toggleWishlist(userId: string, productId: string): Promise<{
    action: 'added' | 'removed';
    wishlist: IWishlistItem[];
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if item already exists in wishlist
    const existingWishlistItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    let action: 'added' | 'removed';

    if (existingWishlistItem) {
      // Remove from wishlist
      existingWishlistItem.deleteOne();
      action = 'removed';
    } else {
      // Add to wishlist
      user.wishlist.push({
        product: new mongoose.Types.ObjectId(productId),
        addedAt: new Date()
      } as any);
      action = 'added';
    }

    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    return {
      action,
      wishlist: user.wishlist
    };
  }

  async clearWishlist(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.wishlist = [] as any;
    await user.save();
  }

  async moveToCart(userId: string, itemId: string, quantity: number = 1): Promise<{
    cart: any[];
    wishlist: IWishlistItem[];
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find wishlist item
    const wishlistItem = user.wishlist.id(itemId);
    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    const productId = wishlistItem.product.toString();

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.inventory.inStock || product.inventory.quantity < quantity) {
      throw new Error('Product is out of stock');
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity in cart
      existingCartItem.quantity += quantity;
      
      // Check if total quantity exceeds stock
      if (existingCartItem.quantity > product.inventory.quantity) {
        throw new Error('Requested quantity exceeds available stock');
      }
    } else {
      // Add new item to cart
      user.cart.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        addedAt: new Date()
      } as any);
    }

    // Remove from wishlist
    wishlistItem.deleteOne();

    await user.save();

    // Populate both cart and wishlist for response
    await user.populate([
      {
        path: 'cart.product',
        select: 'name price images brand category inventory'
      },
      {
        path: 'wishlist.product',
        select: 'name price images brand category rating inventory'
      }
    ]);

    return {
      cart: user.cart,
      wishlist: user.wishlist
    };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }

    return user.wishlist.some(item => item.product.toString() === productId);
  }
}

export default new WishlistService();