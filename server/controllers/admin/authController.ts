import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { AuthenticatedRequest } from '../../types';

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is admin
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin user
// @route   GET /api/admin/auth/me
// @access  Private/Admin
export const getCurrentAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin logout
// @route   POST /api/admin/auth/logout
// @access  Private/Admin
export const logoutAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Admin logout successful'
    });
  } catch (error) {
    next(error);
  }
};
