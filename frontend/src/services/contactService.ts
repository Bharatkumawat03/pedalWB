import api from '@/lib/api/config';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  async submitMessage(messageData: ContactFormData) {
    const response = await api.post('/contact/submit', messageData);
    return response.data;
  },

  async getMessages(filters?: { status?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/contact/messages?${params.toString()}`);
    return response.data;
  },

  async getMessageById(id: string) {
    const response = await api.get(`/contact/messages/${id}`);
    return response.data;
  },

  async updateMessage(id: string, updateData: { status?: string; response?: string }) {
    const response = await api.patch(`/contact/messages/${id}`, updateData);
    return response.data;
  },
};
