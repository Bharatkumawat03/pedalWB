import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if item already exists in wishlist
    const existingWishlistItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    if (existingWishlistItem) {
      res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
      return;
    }

    // Add new item to wishlist
    user.wishlist.push({
      product: productId,
      addedAt: new Date()
    });

    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const wishlistItem = (user.wishlist as any).id(req.params.itemId);
    if (!wishlistItem) {
      res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
      return;
    }

    (user.wishlist as any).pull(req.params.itemId);
    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist by product ID
// @route   DELETE /api/wishlist/product/:productId
// @access  Private
export const removeFromWishlistByProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const wishlistItem = user.wishlist.find(
      item => item.product.toString() === req.params.productId
    );

    if (!wishlistItem) {
      res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
      return;
    }

    user.wishlist = user.wishlist.filter(
      item => item.product.toString() !== req.params.productId
    );
    
    await user.save();

    // Populate wishlist items for response
    await user.populate({
      path: 'wishlist.product',
      select: 'name price images brand category rating inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/:itemId/move-to-cart
// @access  Private
export const moveToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { quantity = 1, selectedColor, selectedSize } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const wishlistItem = (user.wishlist as any).id(req.params.itemId);
    if (!wishlistItem) {
      res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
      return;
    }

    // Check if product exists and is in stock
    const product = await Product.findById(wishlistItem.product);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    if (!product.inventory.inStock || product.inventory.quantity < quantity) {
      res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
      return;
    }

    // Add to cart
    user.cart.push({
      product: wishlistItem.product,
      quantity,
      selectedColor,
      selectedSize,
      addedAt: new Date()
    });

    // Remove from wishlist
    (user.wishlist as any).pull(req.params.itemId);

    await user.save();

    // Populate for response
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

    res.status(200).json({
      success: true,
      message: 'Item moved to cart successfully',
      data: {
        cart: user.cart,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
  moveToCart
};