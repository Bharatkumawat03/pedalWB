import api from '@/lib/api/config';

export const newsletterService = {
  async subscribe(email: string) {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  async unsubscribe(email: string) {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },

  async getSubscribers(filters?: { status?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/newsletter/subscribers?${params.toString()}`);
    return response.data;
  },
};
