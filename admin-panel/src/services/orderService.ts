import api from '@/lib/api/config';
import { Order, OrderFilters } from '@/types/index';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class OrderService {
  // Get all orders with filters and pagination
  async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<OrderFilters>
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    // API interceptor returns { success: true, data: [...], pagination: {...} }
    const response = await api.get(`/admin/orders?${params.toString()}`) as any;
    // Return structure expected by hooks: { data: [...], pagination: {...} }
    return {
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }

  // Get single order
  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/admin/orders/${id}`) as any;
    return response.data || response;
  }

  // Update order status
  async updateOrderStatus(id: string, status: string, notes?: string): Promise<Order> {
    const response = await api.patch(`/admin/orders/${id}/status`, { status, notes }) as any;
    return response.data || response;
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const response = await api.patch(`/admin/orders/${id}/payment-status`, { paymentStatus }) as any;
    return response.data || response;
  }

  // Add tracking number
  async addTrackingNumber(id: string, trackingNumber: string): Promise<Order> {
    const response = await api.patch(`/admin/orders/${id}/tracking`, { trackingNumber }) as any;
    return response.data || response;
  }

  // Cancel order
  async cancelOrder(id: string, reason: string): Promise<Order> {
    const response = await api.patch(`/admin/orders/${id}/cancel`, { reason }) as any;
    return response.data || response;
  }

  // Refund order
  async refundOrder(id: string, amount: number, reason: string): Promise<Order> {
    const response = await api.patch(`/admin/orders/${id}/refund`, { amount, reason }) as any;
    return response.data || response;
  }

  // Get order analytics
  async getOrderAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
    const response = await api.get(`/admin/orders/analytics?period=${period}`) as any;
    return response.data || response;
  }

  // Export orders
  async exportOrders(filters?: Partial<OrderFilters>): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/admin/orders/export?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  }
}

export default new OrderService();
