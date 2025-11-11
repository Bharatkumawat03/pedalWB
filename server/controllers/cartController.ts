import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Calculate cart summary
    const items = user.cart || [];
    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = item.product || {};
      return sum + ((product.price || 0) * (item.quantity || 0));
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + tax + shipping;

    res.status(200).json({
      success: true,
      data: {
        items: user.cart,
        summary: {
          itemCount,
          subtotal,
          tax,
          shipping,
          total,
          freeShippingThreshold: 2000,
          freeShippingEligible: subtotal >= 2000
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Check if product is in stock
    const isInStock = product.isInStock !== false && 
                     (product.inventory?.inStock !== false);
    const availableQuantity = product.inventory?.quantity || 0;
    
    if (!isInStock || availableQuantity < quantity) {
      res.status(400).json({
        success: false,
        message: 'Product is out of stock'
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
      if (existingCartItem.quantity > availableQuantity) {
        res.status(400).json({
          success: false,
          message: 'Requested quantity exceeds available stock'
        });
        return;
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

    // Calculate cart summary
    const items = user.cart || [];
    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = item.product || {};
      return sum + ((product.price || 0) * (item.quantity || 0));
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + tax + shipping;

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        items: user.cart,
        summary: {
          itemCount,
          subtotal,
          tax,
          shipping,
          total,
          freeShippingThreshold: 2000,
          freeShippingEligible: subtotal >= 2000
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { quantity, selectedColor, selectedSize } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const cartItem = (user.cart as any).id(req.params.itemId);
    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
      return;
    }

    // Check product availability if quantity is being updated
    if (quantity && quantity !== cartItem.quantity) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      const isInStock = product.isInStock !== false && 
                       (product.inventory?.inStock !== false);
      const availableQuantity = product.inventory?.quantity || 0;
      
      if (!isInStock || quantity > availableQuantity) {
        res.status(400).json({
          success: false,
          message: 'Requested quantity exceeds available stock'
        });
        return;
      }

      cartItem.quantity = quantity;
    }

    if (selectedColor !== undefined) cartItem.selectedColor = selectedColor;
    if (selectedSize !== undefined) cartItem.selectedSize = selectedSize;

    await user.save();

    // Populate cart items for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    // Calculate cart summary
    const items = user.cart || [];
    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = item.product || {};
      return sum + ((product.price || 0) * (item.quantity || 0));
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + tax + shipping;

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        items: user.cart,
        summary: {
          itemCount,
          subtotal,
          tax,
          shipping,
          total,
          freeShippingThreshold: 2000,
          freeShippingEligible: subtotal >= 2000
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const cartItem = (user.cart as any).id(req.params.itemId);
    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
      return;
    }

    (user.cart as any).pull(req.params.itemId);
    await user.save();

    // Populate cart items for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images brand category inventory'
    });

    // Calculate cart summary
    const items = user.cart || [];
    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = item.product || {};
      return sum + ((product.price || 0) * (item.quantity || 0));
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + tax + shipping;

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        items: user.cart,
        summary: {
          itemCount,
          subtotal,
          tax,
          shipping,
          total,
          freeShippingThreshold: 2000,
          freeShippingEligible: subtotal >= 2000
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        summary: {
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          freeShippingThreshold: 2000,
          freeShippingEligible: false
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};