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

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      // Get user from token
      const user = await User.findById(decoded.id).select('+password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
        return;
      }

      // Check if user is active
      if (user.status !== 'active') {
        res.status(401).json({
          success: false,
          message: 'Account is inactive. Please contact support.'
        });
        return;
      }

      // Check if account is locked
      if (user.isLocked) {
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
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Authorize roles
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
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