import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

// Cart count endpoint
router.get('/count', async (req, res) => {
  try {
    const user = await require('../models/User').default.findById((req as any).user?.id);
    const count = user?.cart?.length || 0;
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting cart count' });
  }
});

export default router;