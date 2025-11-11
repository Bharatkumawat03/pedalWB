import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import contactService, { ContactMessage, ContactFilters } from '@/services/contactService';

export function useContact() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch messages
  const fetchMessages = async (page = 1, limit = 20, filters?: Partial<ContactFilters>) => {
    setLoading(true);
    try {
      const response = await contactService.getMessages(page, limit, filters);
      setMessages(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      setTotalMessages(response.pagination.total);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update message
  const updateMessage = async (id: string, updateData: { status?: string; response?: string }) => {
    setLoading(true);
    try {
      const updated = await contactService.updateMessage(id, updateData);
      toast({
        title: 'Success',
        description: 'Message updated successfully!',
      });
      await fetchMessages(currentPage);
      return updated;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update message',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = async (id: string) => {
    setLoading(true);
    try {
      await contactService.deleteMessage(id);
      toast({
        title: 'Success',
        description: 'Message deleted successfully!',
      });
      await fetchMessages(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete message',
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
      const data = await contactService.getAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMessages();
    fetchAnalytics();
  }, []);

  return {
    messages,
    loading,
    currentPage,
    totalPages,
    totalMessages,
    analytics,
    fetchMessages,
    updateMessage,
    deleteMessage,
    fetchAnalytics,
  };
}



