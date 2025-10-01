import api from '@/lib/api/config';

export interface JobApplicationData {
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
  resume?: File;
}

export const careersService = {
  async submitApplication(applicationData: JobApplicationData) {
    const formData = new FormData();
    
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'resume' && value instanceof File) {
          formData.append('resume', value);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await api.post('/careers/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async getApplications(filters?: { status?: string; position?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.position) params.append('position', filters.position);
    
    const response = await api.get(`/careers/applications?${params.toString()}`);
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await api.get(`/careers/applications/${id}`);
    return response.data;
  },
};
