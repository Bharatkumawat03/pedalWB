import api from '@/lib/api/config';
import { Product, ProductForm, ProductFilters } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductService {
  // Get all products with filters and pagination
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<ProductFilters>
  ): Promise<PaginatedResponse<Product>> {
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

    const response = await api.get(`/admin/products?${params.toString()}`);
    return response.data;
  }

  // Get single product
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/admin/products/${id}`);
    return response.data.data;
  }

  // Create new product
  async createProduct(productData: ProductForm): Promise<Product> {
    const response = await api.post('/admin/products', productData);
    return response.data.data;
  }

  // Update product
  async updateProduct(id: string, productData: Partial<ProductForm>): Promise<Product> {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data.data;
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  }

  // Upload product images
  async uploadImages(images: File[]): Promise<string[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post('/admin/products/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls;
  }

  // Bulk update products
  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<ProductForm> }>): Promise<Product[]> {
    const response = await api.patch('/admin/products/bulk-update', { updates });
    return response.data.data;
  }

  // Bulk delete products
  async bulkDeleteProducts(ids: string[]): Promise<void> {
    await api.delete('/admin/products/bulk-delete', { data: { ids } });
  }
}

export default new ProductService();
