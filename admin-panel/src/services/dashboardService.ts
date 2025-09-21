import api from '@/lib/api/config';
import { DashboardStats } from '@/types';

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  }

  async getAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
    const response = await api.get(`/admin/dashboard/analytics?period=${period}`);
    return response.data.data;
  }
}

export default new DashboardService();
