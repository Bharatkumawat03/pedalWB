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
router.get('/:id/tracking', async (req, res, next) => {
  try {
    const Order = require('../models/Order').default;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    // Verify user owns this order
    if (order.user.toString() !== (req as any).user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    
    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress: order.shippingAddress,
        statusHistory: order.statusHistory || [],
        currentLocation: order.currentLocation
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin order routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

export default router;