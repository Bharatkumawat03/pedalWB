import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingNumber,
  cancelOrder,
  refundOrder,
  getOrderAnalytics,
  exportOrders
} from '../../controllers/admin/orderController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Order routes
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment-status', updatePaymentStatus);
router.patch('/:id/tracking', addTrackingNumber);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/refund', refundOrder);
router.get('/analytics', getOrderAnalytics);
router.get('/export', exportOrders);

export default router;
