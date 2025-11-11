import api from '@/lib/api/config';

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class NewsletterService {
  // Get all subscribers with filters and pagination
  async getSubscribers(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<NewsletterFilters>
  ): Promise<PaginatedResponse<NewsletterSubscriber>> {
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

    const response = await api.get(`/admin/newsletter?${params.toString()}`);
    return response.data;
  }

  // Get single subscriber
  async getSubscriber(id: string): Promise<NewsletterSubscriber> {
    const response = await api.get(`/admin/newsletter/${id}`);
    return response.data.data;
  }

  // Update subscriber status
  async updateSubscriber(id: string, status: 'active' | 'unsubscribed'): Promise<NewsletterSubscriber> {
    const response = await api.patch(`/admin/newsletter/${id}`, { status });
    return response.data.data;
  }

  // Delete subscriber
  async deleteSubscriber(id: string): Promise<void> {
    await api.delete(`/admin/newsletter/${id}`);
  }

  // Bulk unsubscribe
  async bulkUnsubscribe(ids: string[]): Promise<void> {
    await api.post('/admin/newsletter/bulk-unsubscribe', { ids });
  }

  // Get newsletter analytics
  async getAnalytics() {
    const response = await api.get('/admin/newsletter/analytics');
    return response.data.data;
  }
}

export default new NewsletterService();



