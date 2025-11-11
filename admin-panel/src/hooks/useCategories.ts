import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import categoryService from '@/services/categoryService';
import { Category, CategoryForm } from '@/types/index';

export function useCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch categories
  const fetchCategories = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await categoryService.getCategoriesPaginated(page, limit);
      console.log('Categories response:', response); // Debug log
      if (response && response.data && response.pagination) {
        setCategories(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.pages);
        setTotalCategories(response.pagination.total);
      } else {
        console.error('Invalid response structure:', response);
        toast({
          title: 'Error',
          description: 'Invalid response from server',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories (for dropdowns)
  const fetchAllCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      setCategories(categories);
      return categories;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch categories',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Create category
  const createCategory = async (categoryData: CategoryForm) => {
    setLoading(true);
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      toast({
        title: 'Success',
        description: 'Category created successfully!',
      });
      await fetchCategories(currentPage);
      return newCategory;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id: string, categoryData: Partial<CategoryForm>) => {
    setLoading(true);
    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      toast({
        title: 'Success',
        description: 'Category updated successfully!',
      });
      await fetchCategories(currentPage);
      return updatedCategory;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await categoryService.deleteCategory(id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully!',
      });
      await fetchCategories(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle category status
  const toggleCategoryStatus = async (id: string) => {
    setLoading(true);
    try {
      const updatedCategory = await categoryService.toggleCategoryStatus(id);
      toast({
        title: 'Success',
        description: 'Category status updated successfully!',
      });
      await fetchCategories(currentPage);
      return updatedCategory;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category status',
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
      const data = await categoryService.getCategoryAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchAnalytics();
  }, []);

  return {
    categories,
    loading,
    currentPage,
    totalPages,
    totalCategories,
    analytics,
    fetchCategories,
    fetchAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    fetchAnalytics,
  };
}


