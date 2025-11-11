import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import orderService from '@/services/orderService';
import { Order, OrderFilters } from '@/types/index';

export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch orders
  const fetchOrders = async (page = 1, limit = 20, filters?: Partial<OrderFilters>) => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(page, limit, filters);
      console.log('Orders response:', response); // Debug log
      if (response && response.data && response.pagination) {
        setOrders(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.pages);
        setTotalOrders(response.pagination.total);
      } else {
        console.error('Invalid response structure:', response);
        toast({
          title: 'Error',
          description: 'Invalid response from server',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: string, notes?: string) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status, notes);
      toast({
        title: 'Success',
        description: 'Order status updated successfully!',
      });
      await fetchOrders(currentPage);
      return updatedOrder;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.updatePaymentStatus(id, paymentStatus);
      toast({
        title: 'Success',
        description: 'Payment status updated successfully!',
      });
      await fetchOrders(currentPage);
      return updatedOrder;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment status',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add tracking number
  const addTrackingNumber = async (id: string, trackingNumber: string) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.addTrackingNumber(id, trackingNumber);
      toast({
        title: 'Success',
        description: 'Tracking number added successfully!',
      });
      await fetchOrders(currentPage);
      return updatedOrder;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add tracking number',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (id: string, reason: string) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.cancelOrder(id, reason);
      toast({
        title: 'Success',
        description: 'Order cancelled successfully!',
      });
      await fetchOrders(currentPage);
      return updatedOrder;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel order',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    currentPage,
    totalPages,
    totalOrders,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    cancelOrder,
  };
}

