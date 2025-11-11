import api from '@/lib/api/config';

export interface JobApplication {
  _id: string;
  positionTitle: string;
  positionDepartment: string;
  positionLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience?: string;
  currentCompany?: string;
  expectedSalary?: string;
  availableFrom?: string;
  portfolio?: string;
  linkedin?: string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerFilters {
  search?: string;
  status?: string;
  position?: string;
  department?: string;
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

class CareerService {
  // Get all job applications with filters and pagination
  async getApplications(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<CareerFilters>
  ): Promise<PaginatedResponse<JobApplication>> {
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

    const response = await api.get(`/admin/careers?${params.toString()}`);
    return response.data;
  }

  // Get single job application
  async getApplication(id: string): Promise<JobApplication> {
    const response = await api.get(`/admin/careers/${id}`);
    return response.data.data;
  }

  // Update job application
  async updateApplication(id: string, updateData: { status?: string; notes?: string }): Promise<JobApplication> {
    const response = await api.patch(`/admin/careers/${id}`, updateData);
    return response.data.data;
  }

  // Delete job application
  async deleteApplication(id: string): Promise<void> {
    await api.delete(`/admin/careers/${id}`);
  }

  // Get career analytics
  async getAnalytics() {
    const response = await api.get('/admin/careers/analytics');
    return response.data.data;
  }
}

export default new CareerService();

