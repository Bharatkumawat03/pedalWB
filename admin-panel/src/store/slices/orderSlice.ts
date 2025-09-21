import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '@/services/orderService';
import { Order, OrderFilters } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: Partial<OrderFilters>;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page, limit, filters }: { page: number; limit: number; filters?: Partial<OrderFilters> }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders(page, limit, filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await orderService.getOrder(id);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status, notes }: { id: string; status: string; notes?: string }, { rejectWithValue }) => {
    try {
      const order = await orderService.updateOrderStatus(id, status, notes);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ id, paymentStatus }: { id: string; paymentStatus: string }, { rejectWithValue }) => {
    try {
      const order = await orderService.updatePaymentStatus(id, paymentStatus);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTrackingNumber = createAsyncThunk(
  'orders/addTracking',
  async ({ id, trackingNumber }: { id: string; trackingNumber: string }, { rejectWithValue }) => {
    try {
      const order = await orderService.addTrackingNumber(id, trackingNumber);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single order
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      // Update payment status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      // Add tracking number
      .addCase(addTrackingNumber.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { setFilters, clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
