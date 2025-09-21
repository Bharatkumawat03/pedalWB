import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getCurrentUser } from '@/store/slices/authSlice';

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
        // If user has a token, try to get current user
        if (isAuthenticated) {
          await dispatch(getCurrentUser());
          // Note: Cart and wishlist are now managed locally with simple synchronous actions
          // No need to fetch from API as they work with local state
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
