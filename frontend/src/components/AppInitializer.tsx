import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import { fetchCart, mergeGuestCart, loadGuestCart } from '@/store/slices/cartSlice';
import { fetchWishlist } from '@/store/slices/wishlistSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Check if user has a token
        const hasToken = !!localStorage.getItem('token');
        
        if (hasToken && isAuthenticated) {
          // User is authenticated - fetch account cart and merge guest cart if exists
          await dispatch(getCurrentUser());
          
          // Merge guest cart with account cart (if guest cart exists)
          await dispatch(mergeGuestCart());
          
          // Fetch wishlist from API
          await dispatch(fetchWishlist());
        } else if (hasToken && !isAuthenticated) {
          // Token exists but not authenticated yet - try to get current user
          try {
            await dispatch(getCurrentUser());
            // After successful authentication, merge guest cart
            await dispatch(mergeGuestCart());
            await dispatch(fetchWishlist());
          } catch (error) {
            // Token is invalid - load guest cart
            dispatch(loadGuestCart());
          }
        } else {
          // No token - load guest cart from localStorage
          dispatch(loadGuestCart());
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // On error, try to load guest cart
        dispatch(loadGuestCart());
      }
    };

    initializeApp();
  }, [dispatch, isAuthenticated]);

  // Watch for authentication changes to merge guest cart or load guest cart
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated) {
        // User just logged in - merge guest cart
        try {
          await dispatch(mergeGuestCart());
          await dispatch(fetchWishlist());
        } catch (error) {
          console.error('Error merging guest cart:', error);
        }
      } else {
        // User just logged out - load guest cart from localStorage
        dispatch(loadGuestCart());
      }
    };

    handleAuthChange();
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AppInitializer;
