import express from 'express';
import {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User order routes
router.get('/my-orders', getUserOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin order routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

export default router;