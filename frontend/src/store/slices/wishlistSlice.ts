import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '@/services/wishlistService';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem('token');
  } catch {
    return false;
  }
};

// Convert API wishlist item to local wishlist item format
const convertApiWishlistItem = (apiItem: any): WishlistItem => {
  const product = apiItem.product || {};
  const imageUrl = product.images?.find((img: any) => img.isPrimary)?.url || 
                   product.images?.[0]?.url || 
                   product.image || '';
  
  return {
    id: product._id || product.id || apiItem.product?._id || apiItem.product?.id,
    name: product.name || '',
    price: product.price || 0,
    image: imageUrl,
    category: product.category || product.brand || 'General'
  };
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      // Return empty wishlist for guests
      return { items: [], count: 0 };
    }
    try {
      const response = await wishlistService.getWishlist();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('LOGIN_REQUIRED');
    }
    try {
      await wishlistService.addToWishlist(productId);
      // Fetch updated wishlist
      const response = await wishlistService.getWishlist();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      // Fetch updated wishlist
      const response = await wishlistService.getWishlist();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('LOGIN_REQUIRED');
    }
    try {
      await wishlistService.toggleWishlist(productId);
      // Fetch updated wishlist
      const response = await wishlistService.getWishlist();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlistData = action.payload;
        if (wishlistData.items && Array.isArray(wishlistData.items)) {
          state.items = wishlistData.items.map(convertApiWishlistItem);
        } else {
          state.items = [];
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlistData = action.payload;
        if (wishlistData.items && Array.isArray(wishlistData.items)) {
          state.items = wishlistData.items.map(convertApiWishlistItem);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlistData = action.payload;
        if (wishlistData.items && Array.isArray(wishlistData.items)) {
          state.items = wishlistData.items.map(convertApiWishlistItem);
        } else {
          state.items = state.items.filter(item => item.id !== action.meta.arg);
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle wishlist
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        // Handle both direct data and nested data structure
        const wishlistData = response.data || response;
        if (wishlistData.items && Array.isArray(wishlistData.items)) {
          state.items = wishlistData.items.map(convertApiWishlistItem);
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;
