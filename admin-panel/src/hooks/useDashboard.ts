import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import dashboardService from '@/services/dashboardService';

export function useDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch dashboard stats',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async (period: '7d' | '30d' | '90d' | '1y' = '30d') => {
    setLoading(true);
    try {
      const data = await dashboardService.getAnalytics(period);
      setAnalytics(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  return {
    stats,
    analytics,
    loading,
    fetchStats,
    fetchAnalytics,
  };
}



