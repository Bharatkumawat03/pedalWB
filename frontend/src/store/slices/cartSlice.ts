import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '@/services/cartService';
import productService from '@/services/productService';

export interface CartItem {
  id: string; // Product ID
  cartItemId?: string; // Cart item ID from API (for remove/update operations)
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const GUEST_CART_KEY = 'guest_cart';

// localStorage helpers for guest cart
const saveGuestCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving guest cart to localStorage:', error);
  }
};

const getGuestCartItems = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading guest cart from localStorage:', error);
  }
  return [];
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error('Error clearing guest cart from localStorage:', error);
  }
};

const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem('token');
  } catch {
    return false;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, total };
};

// Convert API cart item to local cart item format
const convertApiCartItem = (apiItem: any): CartItem => {
  const product = apiItem.product || {};
  const imageUrl = product.images?.find((img: any) => img.isPrimary)?.url || 
                   product.images?.[0]?.url || 
                   product.image || '';
  
  return {
    id: product._id || product.id || apiItem.product?._id || apiItem.product?.id,
    cartItemId: apiItem._id || apiItem.id, // Preserve cart item ID for API operations
    name: product.name || '',
    price: product.price || 0,
    image: imageUrl,
    quantity: apiItem.quantity || 1,
    category: product.category || product.brand || 'General'
  };
};

// Fetch product details for guest cart items
const fetchProductDetails = async (productId: string): Promise<Partial<CartItem> | null> => {
  try {
    const response = await productService.getProduct(productId);
    const product = response.data || response;
    const imageUrl = product.images?.find((img: any) => img.isPrimary)?.url || 
                     product.images?.[0]?.url || 
                     product.image || '';
    
    return {
      id: product._id || product.id,
      name: product.name || '',
      price: product.price || 0,
      image: imageUrl,
      category: product.category || product.brand || 'General'
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      if (isAuthenticated()) {
        const response = await cartService.getCart();
        return response.data || response;
      } else {
        // Load guest cart from localStorage
        const guestItems = getGuestCartItems();
        return { items: guestItems, summary: calculateTotals(guestItems) };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: { productId: string; quantity?: number }, { rejectWithValue, getState }) => {
    try {
      if (isAuthenticated()) {
        await cartService.addToCart(payload.productId, payload.quantity || 1);
        // Fetch updated cart
        const response = await cartService.getCart();
        return response.data || response;
      } else {
        // Guest cart: add to localStorage
        const state = getState() as any;
        const currentItems = state.cart?.items || [];
        const existingItem = currentItems.find((item: CartItem) => item.id === payload.productId);
        
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = currentItems.map((item: CartItem) =>
            item.id === payload.productId
              ? { ...item, quantity: item.quantity + (payload.quantity || 1) }
              : item
          );
        } else {
          // Fetch product details
          const productDetails = await fetchProductDetails(payload.productId);
          if (!productDetails) {
            return rejectWithValue('Failed to fetch product details');
          }
          updatedItems = [
            ...currentItems,
            {
              ...productDetails,
              quantity: payload.quantity || 1,
            } as CartItem
          ];
        }
        
        saveGuestCart(updatedItems);
        return { items: updatedItems, summary: calculateTotals(updatedItems) };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue, getState }) => {
    try {
      if (isAuthenticated()) {
        await cartService.removeFromCart(itemId);
        // Fetch updated cart
        const response = await cartService.getCart();
        return response.data || response;
      } else {
        // Guest cart: remove from localStorage
        const state = getState() as any;
        const currentItems = state.cart?.items || [];
        const updatedItems = currentItems.filter((item: CartItem) => 
          item.id !== itemId && item.cartItemId !== itemId
        );
        saveGuestCart(updatedItems);
        return { items: updatedItems, summary: calculateTotals(updatedItems) };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from cart');
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (payload: { itemId: string; quantity: number }, { rejectWithValue, getState }) => {
    try {
      if (isAuthenticated()) {
        await cartService.updateCartItem(payload.itemId, payload.quantity);
        // Fetch updated cart
        const response = await cartService.getCart();
        return response.data || response;
      } else {
        // Guest cart: update in localStorage
        const state = getState() as any;
        const currentItems = state.cart?.items || [];
        const updatedItems = currentItems.map((item: CartItem) =>
          (item.id === payload.itemId || item.cartItemId === payload.itemId)
            ? { ...item, quantity: payload.quantity }
            : item
        );
        saveGuestCart(updatedItems);
        return { items: updatedItems, summary: calculateTotals(updatedItems) };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      if (isAuthenticated()) {
        await cartService.clearCart();
      } else {
        clearGuestCart();
      }
      return { items: [], summary: { itemCount: 0, subtotal: 0, tax: 0, shipping: 0, total: 0 } };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

// Merge guest cart with account cart on login
export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async (_, { rejectWithValue }) => {
    try {
      const guestItems = getGuestCartItems();
      if (guestItems.length === 0) {
        // No guest cart to merge, just fetch account cart
        const response = await cartService.getCart();
        return response.data || response;
      }

      // First, fetch the current account cart
      const accountCartResponse = await cartService.getCart();
      const accountCart = accountCartResponse.data || accountCartResponse;
      const accountItems = accountCart.items || [];

      // Create a map of account cart items by product ID for quick lookup
      const accountItemsMap = new Map();
      accountItems.forEach((item: any) => {
        const productId = item.product?._id || item.product?.id || item.product;
        if (productId) {
          accountItemsMap.set(productId.toString(), item);
        }
      });

      // Merge guest items with account cart
      for (const guestItem of guestItems) {
        try {
          const productId = guestItem.id;
          const existingAccountItem = accountItemsMap.get(productId);
          
          if (existingAccountItem) {
            // Item exists in account cart - update quantity (add guest quantity to existing)
            const cartItemId = existingAccountItem._id || existingAccountItem.id;
            const newQuantity = (existingAccountItem.quantity || 0) + guestItem.quantity;
            await cartService.updateCartItem(cartItemId, newQuantity);
          } else {
            // Item doesn't exist in account cart - add it
            await cartService.addToCart(productId, guestItem.quantity);
          }
        } catch (error) {
          console.error(`Error merging item ${guestItem.id}:`, error);
          // Continue with other items even if one fails
        }
      }

      // Fetch updated cart
      const response = await cartService.getCart();
      
      // Clear guest cart after successful merge
      clearGuestCart();
      
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to merge guest cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Sync action for immediate UI update (optimistic update)
    addToCartOptimistic: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      
      // Save to localStorage if not authenticated
      if (!isAuthenticated()) {
        saveGuestCart(state.items);
      }
    },
    // Load guest cart from localStorage
    loadGuestCart: (state) => {
      if (!isAuthenticated()) {
        const guestItems = getGuestCartItems();
        state.items = guestItems;
        const totals = calculateTotals(guestItems);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      }
    },
    // Clear guest cart (used on logout)
    clearGuestCart: (state) => {
      if (!isAuthenticated()) {
        clearGuestCart();
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        if (cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items.map(convertApiCartItem);
        } else if (cartData.summary) {
          // If items are empty but we have summary, keep items as is
          const totals = calculateTotals(state.items);
          state.total = cartData.summary.total || totals.total;
          state.itemCount = cartData.summary.itemCount || totals.itemCount;
        } else {
          state.items = [];
        }
        const totals = calculateTotals(state.items);
        state.total = cartData.summary?.total || totals.total;
        state.itemCount = cartData.summary?.itemCount || totals.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        if (cartData.items && Array.isArray(cartData.items)) {
          // If authenticated, convert API items; if guest, use items as-is
          state.items = isAuthenticated() 
            ? cartData.items.map(convertApiCartItem)
            : cartData.items;
        }
        const totals = calculateTotals(state.items);
        state.total = cartData.summary?.total || totals.total;
        state.itemCount = cartData.summary?.itemCount || totals.itemCount;
        
        // Save to localStorage if not authenticated
        if (!isAuthenticated()) {
          saveGuestCart(state.items);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        if (cartData.items && Array.isArray(cartData.items)) {
          // If authenticated, convert API items; if guest, use items as-is
          state.items = isAuthenticated() 
            ? cartData.items.map(convertApiCartItem)
            : cartData.items;
        } else {
          state.items = state.items.filter(item => item.id !== action.meta.arg);
        }
        const totals = calculateTotals(state.items);
        state.total = cartData.summary?.total || totals.total;
        state.itemCount = cartData.summary?.itemCount || totals.itemCount;
        
        // Save to localStorage if not authenticated
        if (!isAuthenticated()) {
          saveGuestCart(state.items);
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        if (cartData.items && Array.isArray(cartData.items)) {
          // If authenticated, convert API items; if guest, use items as-is
          state.items = isAuthenticated() 
            ? cartData.items.map(convertApiCartItem)
            : cartData.items;
        }
        const totals = calculateTotals(state.items);
        state.total = cartData.summary?.total || totals.total;
        state.itemCount = cartData.summary?.itemCount || totals.itemCount;
        
        // Save to localStorage if not authenticated
        if (!isAuthenticated()) {
          saveGuestCart(state.items);
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        
        // Clear localStorage if not authenticated
        if (!isAuthenticated()) {
          clearGuestCart();
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Merge guest cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear current items to prevent double counting during merge
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        if (cartData.items && Array.isArray(cartData.items)) {
          state.items = cartData.items.map(convertApiCartItem);
        } else {
          state.items = [];
        }
        const totals = calculateTotals(state.items);
        state.total = cartData.summary?.total || totals.total;
        state.itemCount = cartData.summary?.itemCount || totals.itemCount;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToCartOptimistic, loadGuestCart, clearGuestCart: clearGuestCartAction } = cartSlice.actions;
export default cartSlice.reducer;
