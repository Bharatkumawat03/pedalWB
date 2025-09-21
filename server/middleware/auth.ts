import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

// Protect routes - require authentication
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    console.log('Auth middleware - Authorization header:', req.headers.authorization);

    // Check if token exists
    if (!token) {
      console.log('Auth middleware - No token provided');
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      console.log('Auth middleware - Token decoded:', decoded);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('+password');
      console.log('Auth middleware - User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('Auth middleware - User not found in database');
        res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
        return;
      }

      console.log('Auth middleware - User status:', user.status);
      console.log('Auth middleware - User role:', user.role);
      console.log('Auth middleware - User isLocked:', user.isLocked);

      // Check if user is active
      if (user.status !== 'active') {
        console.log('Auth middleware - User not active');
        res.status(401).json({
          success: false,
          message: 'Account is inactive. Please contact support.'
        });
        return;
      }

      // Check if account is locked
      if (user.isLocked) {
        console.log('Auth middleware - User account locked');
        res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts.'
        });
        return;
      }

      // Add user to request object
      req.user = {
        id: user._id?.toString() || '',
        email: user.email,
        role: user.role
      };
      
      console.log('Auth middleware - User added to request:', req.user);
      next();
    } catch (error) {
      console.log('Auth middleware - Token verification failed:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
      return;
    }
  } catch (error) {
    console.log('Auth middleware - General error:', error);
    next(error);
  }
};

// Authorize roles
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log('Authorize middleware - User role:', req.user?.role);
    console.log('Authorize middleware - Required roles:', roles);
    
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Authorize middleware - Access denied');
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }
    next();
  };
};

export default { protect, authorize };
