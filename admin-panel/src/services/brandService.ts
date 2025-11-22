import api from '@/lib/api/config';

export interface Brand {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  country: string;
  status: 'Active' | 'Inactive';
  tier: 'Standard' | 'Premium' | 'Enterprise';
  website?: string;
  foundedYear?: number;
  productCount: number;
  revenue: number;
  featured: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  socialLinks: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BrandFilters {
  search?: string;
  status?: string;
  country?: string;
  tier?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minProducts?: number;
  maxProducts?: number;
  page?: number;
  limit?: number;
}

export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  premiumBrands: number;
  featuredBrands: number;
  totalRevenue: number;
  totalProducts: number;
  brandsByCountry: Array<{ _id: string; count: number }>;
  brandsByTier: Array<{ _id: string; count: number }>;
  topPerformingBrands: Brand[];
}

class BrandService {
  async getBrands(filters: BrandFilters = {}): Promise<{
    brands: Brand[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    filters: {
      countries: string[];
    };
  }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return api.get(`/brands?${params}`);
  }

  async getBrand(id: string): Promise<{
    brand: Brand;
    products: any[];
    productCount: number;
  }> {
    return api.get(`/brands/${id}`);
  }

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const response = await api.post('/brands', brandData) as any;
    return response.brand || response.data?.brand || response;
  }

  async updateBrand(id: string, brandData: Partial<Brand>): Promise<Brand> {
    const response = await api.put(`/brands/${id}`, brandData) as any;
    return response.brand || response.data?.brand || response;
  }

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  }

  async toggleBrandStatus(id: string): Promise<Brand> {
    const response = await api.patch(`/brands/${id}/toggle-status`) as any;
    return response.brand || response.data?.brand || response;
  }

  async getBrandStats(): Promise<BrandStats> {
    return api.get('/brands/stats');
  }

  async bulkUpdateBrands(brandIds: string[], updateData: Partial<Brand>): Promise<{
    message: string;
    modifiedCount: number;
  }> {
    return api.put('/brands/bulk/update', { brandIds, updateData });
  }

  async bulkDeleteBrands(brandIds: string[]): Promise<{
    message: string;
    deletedCount: number;
  }> {
    return api.delete('/brands/bulk/delete', { data: { brandIds } });
  }

  async updateProductCounts(): Promise<{
    message: string;
  }> {
    return api.post('/brands/update-product-counts');
  }
}

export const brandService = new BrandService();
