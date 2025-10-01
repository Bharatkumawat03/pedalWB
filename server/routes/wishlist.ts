import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
  moveToCart
} from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:itemId', removeFromWishlist);
router.delete('/product/:productId', removeFromWishlistByProduct);
router.delete('/', clearWishlist);
router.post('/:itemId/move-to-cart', moveToCart);
router.post('/:productId/move-to-cart', async (req, res, next) => {
  try {
    const { quantity = 1, selectedColor, selectedSize } = req.body;
    const User = require('../models/User').default;
    const Product = require('../models/Product').default;
    
    const user = await User.findById((req as any).user?.id);
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    
    // Add to cart
    const existingCartItem = user.cart.find(
      (item: any) => item.product.toString() === req.params.productId
    );
    
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({
        product: req.params.productId,
        quantity,
        selectedColor,
        selectedSize
      });
    }
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (item: any) => item.product.toString() !== req.params.productId
    );
    
    await user.save();
    res.json({ success: true, message: 'Moved to cart successfully' });
  } catch (error) {
    next(error);
  }
});

// Additional endpoints for frontend compatibility
router.post('/toggle', async (req, res, next): Promise<void> => {
  try {
    const { productId } = req.body;
    const User = require('../models/User').default;
    const user = await User.findById((req as any).user?.id);
    
    const existingItem = user.wishlist.find(
      (item: any) => item.product.toString() === productId
    );
    
    if (existingItem) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (item: any) => item.product.toString() !== productId
      );
      await user.save();
      res.json({ success: true, message: 'Removed from wishlist', inWishlist: false });
    } else {
      // Add to wishlist
      const Product = require('../models/Product').default;
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      user.wishlist.push({ product: productId, addedAt: new Date() });
      await user.save();
      res.json({ success: true, message: 'Added to wishlist', inWishlist: true });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/check/:productId', async (req, res, next): Promise<void> => {
  try {
    const User = require('../models/User').default;
    const user = await User.findById((req as any).user?.id);
    const inWishlist = user.wishlist.some(
      (item: any) => item.product.toString() === req.params.productId
    );
    res.json({ success: true, data: { inWishlist } });
  } catch (error) {
    next(error);
  }
});

export default router;