const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        select: 'name price originalPrice images category brand inventory.inStock inventory.quantity'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate totals
    let subtotal = 0;
    let totalItems = 0;
    
    const cartItems = user.cart.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;
      
      return {
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        itemTotal,
        addedAt: item.addedAt
      };
    });

    // Calculate shipping (free shipping over ₹5000)
    const shippingThreshold = 5000;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 500;
    
    // Calculate tax (GST 18%)
    const taxRate = 0.18;
    const tax = Math.round(subtotal * taxRate);
    
    const total = subtotal + tax + shippingCost;

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          itemCount: totalItems,
          subtotal,
          tax,
          shipping: shippingCost,
          total,
          freeShippingThreshold: shippingThreshold,
          freeShippingEligible: subtotal >= shippingThreshold
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;
    const userId = req.user._id;

    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.inventory.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    if (product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.inventory.quantity} items available`
      });
    }

    // Color and size validation
    if (product.colors && product.colors.length > 0 && selectedColor) {
      if (!product.colors.includes(selectedColor)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid color selection'
        });
      }
    }

    if (product.sizes && product.sizes.length > 0 && selectedSize) {
      if (!product.sizes.includes(selectedSize)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid size selection'
        });
      }
    }

    const user = await User.findById(userId);
    
    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
      
      // Check stock again
      if (user.cart[existingItemIndex].quantity > product.inventory.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.inventory.quantity} items available`
        });
      }
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize
      });
    }

    await user.save();
    
    // Populate cart for response
    await user.populate('cart.product', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: user.cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    const userId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(userId).populate('cart.product');
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock availability
    if (quantity > cartItem.product.inventory.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product.inventory.quantity} items available`
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: user.cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    user.cart.pull(itemId);
    await user.save();

    await user.populate('cart.product', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: user.cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart item count
// @route   GET /api/cart/count
// @access  Private
exports.getCartCount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const itemCount = user.cart.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: { count: itemCount }
    });
  } catch (error) {
    next(error);
  }
};