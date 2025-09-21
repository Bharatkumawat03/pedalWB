import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService, type ProductFilters, type PaginationInfo } from '../../services';

interface ProductState {
  products: any[];
  featuredProducts: any[];
  newProducts: any[];
  currentProduct: any | null;
  relatedProducts: any[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: PaginationInfo | null;
  searchResults: any[];
  searchLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  newProducts: [],
  currentProduct: null,
  relatedProducts: [],
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    sortBy: 'newest',
    page: 1,
    limit: 20
  },
  pagination: null,
  searchResults: [],
  searchLoading: false,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const products = await productService.getFeaturedProducts(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewProducts = createAsyncThunk(
  'products/fetchNewProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const products = await productService.getNewProducts(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, limit = 10 }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const products = await productService.searchProducts(query, limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // Fetch new products
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.newProducts = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearCurrentProduct, clearSearchResults, clearError } = productSlice.actions;
export default productSlice.reducer;