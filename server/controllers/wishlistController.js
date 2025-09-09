const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist.product',
        select: 'name price originalPrice images category brand rating inventory.inStock',
        match: { status: 'active' }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out any null products (deleted/inactive products)
    const wishlistItems = user.wishlist
      .filter(item => item.product !== null)
      .map(item => ({
        _id: item._id,
        product: item.product,
        addedAt: item.addedAt
      }));

    res.status(200).json({
      success: true,
      data: {
        items: wishlistItems,
        count: wishlistItems.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(userId);
    
    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push({ product: productId });
    await user.save();

    // Populate for response
    await user.populate('wishlist.product', 'name price originalPrice images category brand rating');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    const itemIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();

    await user.populate('wishlist.product', 'name price originalPrice images category brand rating');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(userId);
    
    const existingItemIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    let message;
    if (existingItemIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(existingItemIndex, 1);
      message = 'Product removed from wishlist';
    } else {
      // Add to wishlist
      user.wishlist.push({ product: productId });
      message = 'Product added to wishlist';
    }

    await user.save();
    await user.populate('wishlist.product', 'name price originalPrice images category brand rating');

    res.status(200).json({
      success: true,
      message,
      data: {
        inWishlist: existingItemIndex === -1,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.wishlist = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const inWishlist = user.wishlist.some(item => 
      item.product.toString() === productId
    );

    res.status(200).json({
      success: true,
      data: { inWishlist }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
exports.moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity = 1, selectedColor, selectedSize } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    // Check if product is in wishlist
    const wishlistItemIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    if (wishlistItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.inventory.inStock || product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Add to cart
    const existingCartItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    if (existingCartItemIndex > -1) {
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize
      });
    }

    // Remove from wishlist
    user.wishlist.splice(wishlistItemIndex, 1);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product moved to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};