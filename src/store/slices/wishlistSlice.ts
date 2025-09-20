import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistService, type WishlistItem } from '../../services';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

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

// Async thunks for API integration
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

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
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

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
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

export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggleWishlistAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistService.toggleWishlist(productId);
      return response.data.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clearWishlistAsync',
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
    // Synchronous reducers for local state management
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
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
      // Add to wishlist async
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from wishlist async
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Toggle wishlist async
      .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear wishlist async
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.items = [];
      })
      // Move to cart
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, clearError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
