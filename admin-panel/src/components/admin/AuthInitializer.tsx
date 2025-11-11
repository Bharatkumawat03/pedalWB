import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCurrentAdmin } from "@/store/slices/authSlice";

/**
 * Component to initialize authentication state on app load
 * Checks if user has a valid token and fetches current user data
 */
export function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only fetch current user if we have a token but aren't authenticated yet
    // This handles the case where the app reloads and we have a stored token
    if (token && !isAuthenticated) {
      dispatch(getCurrentAdmin());
    }
  }, [dispatch, token, isAuthenticated]);

  return null;
}


