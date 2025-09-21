import api from '../lib/api/config';

export interface OrderItem {
  product: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cod';
  couponCode?: string;
  loyaltyPointsUsed?: number;
  notes?: string;
}

class OrderService {
  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<any> {
    return await api.post('/orders', orderData);
  }

  // Get user orders
  async getUserOrders(page = 1, limit = 10, status?: string): Promise<any> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });
    
    if (status) {
      params.append('status', status);
    }

    return await api.get(`/orders?${params.toString()}`);
  }

  // Get single order
  async getOrder(orderId: string): Promise<any> {
    return await api.get(`/orders/${orderId}`);
  }

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<any> {
    return await api.put(`/orders/${orderId}/cancel`, { reason });
  }

  // Get order tracking
  async getOrderTracking(orderId: string): Promise<any> {
    return await api.get(`/orders/${orderId}/tracking`);
  }
}

export default new OrderService();