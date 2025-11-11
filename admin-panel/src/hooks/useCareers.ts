import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import careerService, { JobApplication, CareerFilters } from '@/services/careerService';

export function useCareers() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch applications
  const fetchApplications = async (page = 1, limit = 20, filters?: Partial<CareerFilters>) => {
    setLoading(true);
    try {
      const response = await careerService.getApplications(page, limit, filters);
      setApplications(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      setTotalApplications(response.pagination.total);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update application
  const updateApplication = async (id: string, updateData: { status?: string; notes?: string }) => {
    setLoading(true);
    try {
      const updated = await careerService.updateApplication(id, updateData);
      toast({
        title: 'Success',
        description: 'Application updated successfully!',
      });
      await fetchApplications(currentPage);
      return updated;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete application
  const deleteApplication = async (id: string) => {
    setLoading(true);
    try {
      await careerService.deleteApplication(id);
      toast({
        title: 'Success',
        description: 'Application deleted successfully!',
      });
      await fetchApplications(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete application',
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
      const data = await careerService.getAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchApplications();
    fetchAnalytics();
  }, []);

  return {
    applications,
    loading,
    currentPage,
    totalPages,
    totalApplications,
    analytics,
    fetchApplications,
    updateApplication,
    deleteApplication,
    fetchAnalytics,
  };
}



