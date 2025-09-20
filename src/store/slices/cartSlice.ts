import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService, type CartItem, type CartSummary } from '../../services';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, total };
};

// Async thunks for API integration
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

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
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

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
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

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
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

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
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
    // Synchronous reducers for local state management
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.summary = null;
    },
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
        const totals = calculateTotals(action.payload.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart async
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        const totals = calculateTotals(action.payload.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item async
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        const totals = calculateTotals(action.payload.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      // Remove from cart async
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        const totals = calculateTotals(action.payload.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      // Clear cart async
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.summary = null;
        state.total = 0;
        state.itemCount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearError } = cartSlice.actions;

// Export async thunks with legacy names for compatibility
export { updateCartItemAsync as updateCartItem };

export default cartSlice.reducer;
