const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getOrderTracking,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderSchema } = require('../middleware/validation');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.get('/', getUserOrders);
router.post('/', validate(orderSchema), createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/tracking', getOrderTracking);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;