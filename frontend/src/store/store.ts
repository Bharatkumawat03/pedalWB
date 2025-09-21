import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import wishlistSlice from './slices/wishlistSlice';
import filtersSlice from './slices/filtersSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishlistSlice,
    filters: filtersSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
