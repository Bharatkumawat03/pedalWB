import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import userService from '@/services/userService';
import { User, UserForm } from '@/types/index';

export function useUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users
  const fetchUsers = async (page = 1, limit = 20, filters?: any) => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, limit, filters);
      console.log('Users response:', response); // Debug log
      if (response && response.data && response.pagination) {
        setUsers(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.pages);
        setTotalUsers(response.pagination.total);
      } else {
        console.error('Invalid response structure:', response);
        toast({
          title: 'Error',
          description: 'Invalid response from server',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData: UserForm) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser(userData);
      toast({
        title: 'Success',
        description: 'User created successfully!',
      });
      await fetchUsers(currentPage);
      return newUser;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id: string, userData: Partial<UserForm>) => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(id, userData);
      toast({
        title: 'Success',
        description: 'User updated successfully!',
      });
      await fetchUsers(currentPage);
      return updatedUser;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      toast({
        title: 'Success',
        description: 'User deleted successfully!',
      });
      await fetchUsers(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Suspend user
  const suspendUser = async (id: string, reason: string) => {
    setLoading(true);
    try {
      await userService.suspendUser(id, reason);
      toast({
        title: 'Success',
        description: 'User suspended successfully!',
      });
      await fetchUsers(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to suspend user',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Activate user
  const activateUser = async (id: string) => {
    setLoading(true);
    try {
      await userService.activateUser(id);
      toast({
        title: 'Success',
        description: 'User activated successfully!',
      });
      await fetchUsers(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate user',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    currentPage,
    totalPages,
    totalUsers,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
  };
}

