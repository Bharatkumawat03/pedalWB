import api from '@/lib/api/config';
import { Product, ProductForm, ProductFilters } from '@/types/index';

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

    // API interceptor returns { success: true, data: [...], pagination: {...} }
    const response = await api.get(`/admin/products?${params.toString()}`) as any;
    // Return structure expected by hooks: { data: [...], pagination: {...} }
    return {
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }

  // Get single product
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/admin/products/${id}`) as any;
    return response.data || response;
  }

  // Create new product
  async createProduct(productData: ProductForm): Promise<Product> {
    // Transform frontend format to backend format
    const transformedData: any = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      originalPrice: productData.originalPrice,
      category: productData.category, // Should be one of the enum values
      brand: productData.brand,
      featured: productData.isFeatured || false,
      status: 'active', // Default status
      // Transform images - frontend sends array of strings, backend expects array of objects
      images: productData.images?.map((img: string, index: number) => ({
        url: img,
        altText: `Product image ${index + 1}`,
        isPrimary: index === 0
      })) || [],
      // Transform features
      features: productData.features || [],
      // Transform inventory - frontend sends stock, backend expects inventory.quantity
      inventory: {
        quantity: productData.stock || 0,
        inStock: (productData.stock || 0) > 0,
        lowStockThreshold: 5
      },
      // Add other required fields
      rating: {
        average: 0,
        count: 0
      },
      tags: [],
      discount: productData.originalPrice 
        ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
        : 0
    };

    const response = await api.post('/admin/products', transformedData) as any;
    return response.data || response;
  }

  // Update product
  async updateProduct(id: string, productData: Partial<ProductForm>): Promise<Product> {
    // Transform frontend format to backend format
    const transformedData: any = {};

    if (productData.name !== undefined) transformedData.name = productData.name;
    if (productData.description !== undefined) transformedData.description = productData.description;
    if (productData.price !== undefined) transformedData.price = productData.price;
    if (productData.originalPrice !== undefined) transformedData.originalPrice = productData.originalPrice;
    if (productData.category !== undefined) transformedData.category = productData.category;
    if (productData.brand !== undefined) transformedData.brand = productData.brand;
    if (productData.isFeatured !== undefined) transformedData.featured = productData.isFeatured;
    
    // Transform images if provided
    if (productData.images !== undefined) {
      transformedData.images = productData.images.map((img: string, index: number) => ({
        url: img,
        altText: `Product image ${index + 1}`,
        isPrimary: index === 0
      }));
    }
    
    // Transform features if provided
    if (productData.features !== undefined) {
      transformedData.features = productData.features;
    }
    
    // Transform inventory if stock is provided
    if (productData.stock !== undefined) {
      transformedData.inventory = {
        quantity: productData.stock,
        inStock: productData.stock > 0,
        lowStockThreshold: 5
      };
    }
    
    // Calculate discount if both prices are present
    if (productData.originalPrice !== undefined && productData.price !== undefined) {
      transformedData.discount = productData.originalPrice > 0
        ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
        : 0;
    }

    const response = await api.put(`/admin/products/${id}`, transformedData) as any;
    return response.data || response;
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
    }) as any;

    return response.urls || response.data?.urls || [];
  }

  // Bulk update products
  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<ProductForm> }>): Promise<Product[]> {
    const response = await api.patch('/admin/products/bulk-update', { updates }) as any;
    return response.data || response;
  }

  // Bulk delete products
  async bulkDeleteProducts(ids: string[]): Promise<void> {
    await api.delete('/admin/products/bulk-delete', { data: { ids } });
  }
}

export default new ProductService();
