import { Request, Response, NextFunction } from 'express';
import Order, { IOrder } from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Filter by status
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate as string);
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getUserOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user?.id })
      .populate('items.product', 'name images brand')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({ user: req.user?.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images brand category');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      totalAmount,
      notes
    } = req.body;

    // Validate items and check inventory
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
        return;
      }

      if (!product.inventory.inStock || product.inventory.quantity < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
        return;
      }
    }

    const order = await Order.create({
      user: req.user?.id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      totalAmount,
      notes
    });

    // Update product inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': -item.quantity }
      });
    }

    // Clear user's cart after successful order
    const user = await User.findById(req.user?.id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    order.orderStatus = orderStatus;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (orderStatus === 'cancelled') {
      order.cancelledAt = new Date();
      
      // Restore inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'inventory.quantity': item.quantity }
        });
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { paymentStatus, refundAmount, refundReason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'refunded') {
      order.refundAmount = refundAmount || order.totalAmount;
      order.refundReason = refundReason;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
      return;
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': item.quantity }
      });
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
};