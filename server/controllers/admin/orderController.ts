import { Request, Response, NextFunction } from 'express';
import Order from '../../models/Order';
import { AuthenticatedRequest } from '../../types';

// @desc    Get all orders with admin filters and pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'user.firstName': { $regex: req.query.search, $options: 'i' } },
        { 'user.lastName': { $regex: req.query.search, $options: 'i' } },
        { 'user.email': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.dateFrom && req.query.dateTo) {
      filter.createdAt = {
        $gte: new Date(req.query.dateFrom as string),
        $lte: new Date(req.query.dateTo as string)
      };
    }

    // Build sort object
    const sort: any = {};
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price image')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image description');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { notes }),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PATCH /api/admin/orders/:id/payment-status
// @access  Private/Admin
export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add tracking number
// @route   PATCH /api/admin/orders/:id/tracking
// @access  Private/Admin
export const addTrackingNumber = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        trackingNumber,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PATCH /api/admin/orders/:id/cancel
// @access  Private/Admin
export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund order
// @route   PATCH /api/admin/orders/:id/refund
// @access  Private/Admin
export const refundOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'refunded',
        refundAmount: amount,
        refundReason: reason,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order analytics
// @route   GET /api/admin/orders/analytics
// @access  Private/Admin
export const getOrderAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get order analytics
    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: analytics[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export orders
// @route   GET /api/admin/orders/export
// @access  Private/Admin
export const exportOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This would generate and return a CSV/Excel file
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Export functionality will be implemented'
    });
  } catch (error) {
    next(error);
  }
};
