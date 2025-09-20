import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService, type CartItem, type CartSummary } from '../../services';

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
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
      await cartService.addToCart(productId, quantity, selectedColor, selectedSize);
      // Fetch updated cart
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      // Fetch updated cart
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(itemId);
      // Fetch updated cart
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return { items: [], summary: null };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCartCount = createAsyncThunk(
  'cart/getCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await cartService.getCartCount();
      return count;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.summary = null;
      });
  },
});

export const { clearError } = cartSlice.actions;

// Export async thunks with legacy names for compatibility
export { updateCartItem as updateQuantity };
export default cartSlice.reducer;
