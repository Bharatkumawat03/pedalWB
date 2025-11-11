import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import newsletterService, { NewsletterSubscriber, NewsletterFilters } from '@/services/newsletterService';

export function useNewsletter() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch subscribers
  const fetchSubscribers = async (page = 1, limit = 20, filters?: Partial<NewsletterFilters>) => {
    setLoading(true);
    try {
      const response = await newsletterService.getSubscribers(page, limit, filters);
      setSubscribers(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      setTotalSubscribers(response.pagination.total);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch subscribers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update subscriber
  const updateSubscriber = async (id: string, status: 'active' | 'unsubscribed') => {
    setLoading(true);
    try {
      const updated = await newsletterService.updateSubscriber(id, status);
      toast({
        title: 'Success',
        description: 'Subscriber updated successfully!',
      });
      await fetchSubscribers(currentPage);
      return updated;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscriber',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id: string) => {
    setLoading(true);
    try {
      await newsletterService.deleteSubscriber(id);
      toast({
        title: 'Success',
        description: 'Subscriber deleted successfully!',
      });
      await fetchSubscribers(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subscriber',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Bulk unsubscribe
  const bulkUnsubscribe = async (ids: string[]) => {
    setLoading(true);
    try {
      await newsletterService.bulkUnsubscribe(ids);
      toast({
        title: 'Success',
        description: `${ids.length} subscribers unsubscribed successfully!`,
      });
      await fetchSubscribers(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to unsubscribe subscribers',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const data = await newsletterService.getAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSubscribers();
    fetchAnalytics();
  }, []);

  return {
    subscribers,
    loading,
    currentPage,
    totalPages,
    totalSubscribers,
    analytics,
    fetchSubscribers,
    updateSubscriber,
    deleteSubscriber,
    bulkUnsubscribe,
    fetchAnalytics,
  };
}



