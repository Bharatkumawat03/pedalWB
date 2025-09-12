import Order, { IOrder, OrderStatus, PaymentStatus } from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  totalAmount: number;
  notes?: string;
}

export interface OrderQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface OrderResponse {
  orders: IOrder[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

class OrderService {
  async createOrder(userId: string, orderData: CreateOrderData): Promise<IOrder> {
    const { items, shippingAddress, billingAddress, paymentMethod, subtotal, tax, shipping, discount, totalAmount, notes } = orderData;

    // Validate items and check inventory
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      if (!product.inventory.inStock || product.inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    }

    const order = await Order.create({
      user: userId,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount: discount || 0,
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
    const user = await User.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }

    // Return populated order
    return await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand category') as IOrder;
  }

  async getOrders(query: OrderQuery, pagination: PaginationOptions): Promise<OrderResponse> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build MongoDB query
    const mongoQuery: any = {};

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.paymentStatus) {
      mongoQuery.paymentStatus = query.paymentStatus;
    }

    if (query.dateFrom || query.dateTo) {
      mongoQuery.createdAt = {};
      if (query.dateFrom) {
        mongoQuery.createdAt.$gte = query.dateFrom;
      }
      if (query.dateTo) {
        mongoQuery.createdAt.$lte = query.dateTo;
      }
    }

    if (query.search) {
      mongoQuery.$or = [
        { orderNumber: { $regex: query.search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: query.search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(mongoQuery)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(mongoQuery);

    return {
      orders,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserOrders(userId: string, pagination: PaginationOptions): Promise<OrderResponse> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name images brand')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({ user: userId });

    return {
      orders,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images brand category price');
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<IOrder | null> {
    const updateData: any = { paymentStatus, updatedAt: new Date() };
    
    // Set payment date if payment is completed
    if (paymentStatus === 'completed') {
      updateData.paymentDate = new Date();
    }

    return await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');
  }

  async cancelOrder(orderId: string, reason?: string): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    // Restore product inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': item.quantity }
      });
    }

    return await Order.findByIdAndUpdate(
      orderId,
      { 
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email')
      .populate('items.product', 'name images brand');
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    averageOrderValue: number;
  }> {
    const totalOrders = await Order.countDocuments();
    
    const revenueAggregation = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ 
      status: { $in: ['pending', 'confirmed', 'processing'] } 
    });

    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    const avgOrderAggregation = await Order.aggregate([
      { $group: { _id: null, averageOrderValue: { $avg: '$totalAmount' } } }
    ]);

    return {
      totalOrders,
      totalRevenue: revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0,
      pendingOrders,
      completedOrders,
      averageOrderValue: avgOrderAggregation.length > 0 
        ? Math.round(avgOrderAggregation[0].averageOrderValue * 100) / 100 
        : 0
    };
  }
}

export default new OrderService();