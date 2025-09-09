import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchWishlist } from '@/store/slices/wishlistSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // If user has a token, try to get current user
        if (isAuthenticated) {
          await dispatch(getCurrentUser());
          // Load cart and wishlist for authenticated users
          dispatch(fetchCart());
          dispatch(fetchWishlist());
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AppInitializer;