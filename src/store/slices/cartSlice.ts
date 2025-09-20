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
  // Add safety check for undefined or null items
  if (!items || !Array.isArray(items)) {
    return { itemCount: 0, total: 0 };
  }
  
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
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
  async (productId: string, { rejectWithValue }) => {
    try {
      await cartService.addToCart(productId, 1);
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
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      await cartService.updateCartItem(productId, quantity);
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
  async (productId: string, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(productId);
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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions for immediate UI updates
    addToCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // This would typically come from product data, but for now we'll add a placeholder
        state.items.push({
          id: productId,
          name: 'Product',
          price: 0,
          image: '',
          quantity,
          category: 'general'
        });
      }
      
      const { itemCount, total } = calculateTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      const { itemCount, total } = calculateTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      state.summary = null;
    },
    
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload || [];
      const { itemCount, total } = calculateTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;
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
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || null;
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || null;
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || null;
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || null;
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || null;
        state.itemCount = 0;
        state.total = 0;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCartItems, 
  clearError 
} = cartSlice.actions;

export default cartSlice.reducer;
