const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      loyaltyPointsUsed = 0,
      notes
    } = req.body;

    const userId = req.user._id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || product.status !== 'active') {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (!product.inventory.inStock || product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        totalPrice: itemTotal
      });
    }

    // Calculate shipping
    const shippingCost = subtotal >= 5000 ? 0 : 500;
    
    // Calculate tax (GST 18%)
    const tax = Math.round(subtotal * 0.18);
    
    // Apply discount (coupon/loyalty points)
    let discount = 0;
    if (loyaltyPointsUsed > 0) {
      // Validate user has enough loyalty points
      const user = await User.findById(userId);
      if (user.loyaltyPoints < loyaltyPointsUsed) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient loyalty points'
        });
      }
      discount += loyaltyPointsUsed; // 1 point = ₹1
    }

    const total = subtotal + tax + shippingCost - discount;

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: shippingAddress || billingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricing: {
        subtotal,
        tax,
        shipping: shippingCost,
        discount,
        total
      },
      payment: {
        method: paymentMethod
      },
      notes,
      couponCode,
      loyaltyPointsUsed,
      loyaltyPointsEarned: Math.floor(total * 0.01) // 1% of total as loyalty points
    });

    // Update product inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': -item.quantity }
      });
    }

    // Update user loyalty points and total spent
    const user = await User.findById(userId);
    user.loyaltyPoints = user.loyaltyPoints - loyaltyPointsUsed + order.loyaltyPointsEarned;
    user.totalSpent += total;
    user.orderHistory.push(order._id);
    
    // Clear user's cart
    user.cart = [];
    await user.save();

    await order.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name images category brand' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    let query = { user: userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('items.product', 'name images category brand')
      .select('-statusHistory -adminNotes');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: orders.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    let query = { _id: orderId };
    if (!isAdmin) {
      query.user = userId; // Users can only see their own orders
    }

    const order = await Order.findOne(query)
      .populate([
        { path: 'user', select: 'firstName lastName email phone' },
        { path: 'items.product', select: 'name images category brand' },
        { path: 'statusHistory.updatedBy', select: 'firstName lastName' }
      ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    
    await order.addStatusHistory('cancelled', `Order cancelled by customer: ${reason}`, userId);

    // Restore product inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': item.quantity }
      });
    }

    // Refund loyalty points if used
    if (order.loyaltyPointsUsed > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { loyaltyPoints: order.loyaltyPointsUsed }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order tracking
// @route   GET /api/orders/:id/tracking
// @access  Private
exports.getOrderTracking = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).select('orderNumber status shipping statusHistory createdAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create tracking timeline
    const trackingSteps = [
      { status: 'pending', label: 'Order Placed', completed: true },
      { status: 'confirmed', label: 'Order Confirmed', completed: false },
      { status: 'processing', label: 'Processing', completed: false },
      { status: 'shipped', label: 'Shipped', completed: false },
      { status: 'out_for_delivery', label: 'Out for Delivery', completed: false },
      { status: 'delivered', label: 'Delivered', completed: false }
    ];

    const currentStatusIndex = trackingSteps.findIndex(step => step.status === order.status);
    
    for (let i = 0; i <= currentStatusIndex; i++) {
      trackingSteps[i].completed = true;
    }

    // Add timestamps from status history
    trackingSteps.forEach(step => {
      const historyEntry = order.statusHistory.find(entry => entry.status === step.status);
      if (historyEntry) {
        step.timestamp = historyEntry.timestamp;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        estimatedDelivery: order.shipping.estimatedDelivery,
        steps: trackingSteps
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      shippingStatus,
      dateFrom,
      dateTo,
      search
    } = req.query;

    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query['payment.status'] = paymentStatus;
    if (shippingStatus) query['shipping.status'] = shippingStatus;
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate([
        { path: 'user', select: 'firstName lastName email' },
        { path: 'items.product', select: 'name images' }
      ]);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: orders.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    await order.addStatusHistory(status, note, req.user._id);

    // Update shipping info if provided
    if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
    if (carrier) order.shipping.carrier = carrier;
    
    if (status === 'shipped') {
      order.shipping.shippedAt = new Date();
      order.shipping.status = 'shipped';
    } else if (status === 'delivered') {
      order.shipping.deliveredAt = new Date();
      order.shipping.status = 'delivered';
      order.payment.status = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};