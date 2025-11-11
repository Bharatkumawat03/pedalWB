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
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  totalAmount: number;
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

    const response = await api.get(`/orders/my-orders?${params.toString()}`) as any;
    return response;
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