import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistService, type WishlistItem } from '../../services';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      return response.data.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistService.addToWishlist(productId);
      // Fetch updated wishlist
      const response = await wishlistService.getWishlist();
      return response.data.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      return response.data.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistService.toggleWishlist(productId);
      return response.data.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await wishlistService.clearWishlist();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ 
    productId, 
    quantity = 1, 
    selectedColor, 
    selectedSize 
  }: { 
    productId: string; 
    quantity?: number; 
    selectedColor?: string; 
    selectedSize?: string; 
  }, { rejectWithValue }) => {
    try {
      await wishlistService.moveToCart(productId, quantity, selectedColor, selectedSize);
      // Fetch updated wishlist
      const response = await wishlistService.getWishlist();
      return response.data.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Toggle wishlist
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      })
      // Move to cart
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;