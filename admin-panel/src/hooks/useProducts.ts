import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import { Product, ProductForm } from '@/types/index';

export function useProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products
  const fetchProducts = async (page = 1, limit = 20, filters?: any) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(page, limit, filters);
      console.log('Products response:', response); // Debug log
      if (response && response.data && response.pagination) {
        setProducts(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.pages);
        setTotalProducts(response.pagination.total);
      } else {
        console.error('Invalid response structure:', response);
        toast({
          title: 'Error',
          description: 'Invalid response from server',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      setCategories(categories);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Create product
  const createProduct = async (productData: ProductForm) => {
    setLoading(true);
    try {
      const newProduct = await productService.createProduct(productData);
      toast({
        title: 'Success',
        description: 'Product created successfully!',
      });
      await fetchProducts(currentPage);
      return newProduct;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: Partial<ProductForm>) => {
    setLoading(true);
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      toast({
        title: 'Success',
        description: 'Product updated successfully!',
      });
      await fetchProducts(currentPage);
      return updatedProduct;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully!',
      });
      await fetchProducts(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete
  const bulkDeleteProducts = async (ids: string[]) => {
    setLoading(true);
    try {
      await productService.bulkDeleteProducts(ids);
      toast({
        title: 'Success',
        description: `${ids.length} products deleted successfully!`,
      });
      await fetchProducts(currentPage);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete products',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
  };
}

