import api from '@/lib/api/config';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
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

class ContactService {
  // Get all contact messages with filters and pagination
  async getMessages(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<ContactFilters>
  ): Promise<PaginatedResponse<ContactMessage>> {
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

    const response = await api.get(`/admin/contact?${params.toString()}`);
    return response.data;
  }

  // Get single contact message
  async getMessage(id: string): Promise<ContactMessage> {
    const response = await api.get(`/admin/contact/${id}`);
    return response.data.data;
  }

  // Update contact message
  async updateMessage(id: string, updateData: { status?: string; response?: string }): Promise<ContactMessage> {
    const response = await api.patch(`/admin/contact/${id}`, updateData);
    return response.data.data;
  }

  // Delete contact message
  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/admin/contact/${id}`);
  }

  // Get contact analytics
  async getAnalytics() {
    const response = await api.get('/admin/contact/analytics');
    return response.data.data;
  }
}

export default new ContactService();

